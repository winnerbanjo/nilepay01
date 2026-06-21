import { MongoClient } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';
import Busboy from 'busboy';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cache = globalThis.__nilePayDb || { client: null, db: null };
globalThis.__nilePayDb = cache;

async function database() {
  if (cache.db) return cache.db;
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not configured.');
  cache.client = new MongoClient(process.env.MONGODB_URI);
  await cache.client.connect();
  cache.db = cache.client.db(process.env.MONGODB_DATABASE || undefined);
  await Promise.all([
    cache.db.collection('applications').createIndex({ id: 1 }, { unique: true }),
    cache.db.collection('audit_events').createIndex({ application_id: 1, created_at: -1 }),
  ]);
  return cache.db;
}

const send = (response, status, body) => {
  response.setHeader('Cache-Control', 'no-store');
  return response.status(status).json(body);
};

async function bodyOf(request) {
  if (request.body && typeof request.body === 'object' && !Buffer.isBuffer(request.body)) return request.body;
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

async function save(db, application, actor = 'Nile Pay') {
  if (!application?.id) throw new Error('Application id is required.');
  const applications = db.collection('applications');
  const previous = await applications.findOne({ id: application.id });
  const { _id, ...input } = application;
  const updated = {
    ...input,
    status: input.status || 'Draft',
    kycData: input.kycData || {},
    documentVerification: input.documentVerification || {},
    timeline: Array.isArray(input.timeline) ? input.timeline : [],
    updated_at: new Date().toISOString(),
  };
  await applications.updateOne({ id: updated.id }, { $set: updated }, { upsert: true });

  if (!previous || previous.status !== updated.status) {
    await db.collection('audit_events').insertOne({
      application_id: updated.id,
      event_type: previous ? 'application.status_changed' : 'application.created',
      actor,
      payload: previous ? { from: previous.status, to: updated.status } : { status: updated.status },
      created_at: updated.updated_at,
    });
  }
  return updated;
}

function upload(request, response) {
  return new Promise((resolve) => {
    const parser = Busboy({ headers: request.headers, limits: { files: 1, fileSize: 5 * 1024 * 1024 } });
    let received = false;
    parser.on('file', (_field, file, info) => {
      received = true;
      const safeName = info.filename.replace(/[^a-zA-Z0-9_.-]/g, '_');
      const stream = cloudinary.uploader.upload_stream({
        folder: 'nilepay_kyc',
        resource_type: 'auto',
        public_id: `${Date.now()}_${safeName}`,
      }, (error, result) => {
        if (error) {
          send(response, 500, { error: 'Cloudinary upload failed.' });
          return resolve();
        }
        send(response, 201, {
          url: result.secure_url,
          downloadUrl: result.secure_url.replace('/upload/', '/upload/fl_attachment/'),
          publicId: result.public_id,
          name: info.filename,
          size: `${(result.bytes / (1024 * 1024)).toFixed(1)}MB`,
          bytes: result.bytes,
          type: info.mimeType,
        });
        resolve();
      });
      file.pipe(stream);
    });
    parser.on('error', (error) => { send(response, 400, { error: error.message }); resolve(); });
    parser.on('finish', () => {
      if (!received) { send(response, 400, { error: 'No document was provided.' }); resolve(); }
    });
    request.pipe(parser);
  });
}

export default async function handler(request, response) {
  const route = Array.isArray(request.query.route) ? request.query.route : [request.query.route].filter(Boolean);
  try {
    if (request.method === 'GET' && route[0] === 'health') {
      await database();
      return send(response, 200, { ok: true, database: 'connected', cloudinary: Boolean(process.env.CLOUDINARY_CLOUD_NAME) });
    }
    if (request.method === 'POST' && route[0] === 'upload') {
      if (!process.env.CLOUDINARY_CLOUD_NAME) return send(response, 503, { error: 'Cloudinary is not configured.' });
      return upload(request, response);
    }

    const db = await database();
    const applications = db.collection('applications');
    if (request.method === 'GET' && route.length === 1 && route[0] === 'applications') {
      return send(response, 200, { applications: await applications.find({}).sort({ updated_at: -1 }).toArray() });
    }
    if (request.method === 'GET' && route[0] === 'applications' && route[2] === 'audit') {
      const events = await db.collection('audit_events').find({ application_id: route[1] }).sort({ created_at: -1 }).toArray();
      return send(response, 200, { events });
    }
    if (request.method === 'GET' && route[0] === 'applications' && route[1]) {
      const application = await applications.findOne({ id: route[1] });
      return application ? send(response, 200, { application }) : send(response, 404, { error: 'Application not found.' });
    }
    if (request.method === 'PUT' && route.length === 1 && route[0] === 'applications') {
      const body = await bodyOf(request);
      if (!Array.isArray(body.applications)) return send(response, 400, { error: 'applications must be an array.' });
      const saved = [];
      for (const application of body.applications) saved.push(await save(db, application, body.actor));
      return send(response, 200, { applications: saved });
    }
    if (request.method === 'POST' && route[0] === 'bootstrap') {
      const body = await bodyOf(request);
      if (await applications.countDocuments()) return send(response, 200, { applications: await applications.find({}).toArray(), bootstrapped: false });
      const saved = [];
      for (const application of body.applications || []) saved.push(await save(db, application, 'Initial bootstrap'));
      return send(response, 201, { applications: saved, bootstrapped: true });
    }
    return send(response, 404, { error: 'API route not found.' });
  } catch (error) {
    console.error(error);
    return send(response, 500, { error: error.message || 'Unexpected server error.' });
  }
}
