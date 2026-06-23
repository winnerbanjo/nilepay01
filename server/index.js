import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { MongoClient } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';
import Busboy from 'busboy';

const port = Number(process.env.API_PORT || 8787);
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png']);

function requireConfiguration() {
  const required = [
    'MONGODB_URI',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

requireConfiguration();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  secure: true,
});

const mongoClient = new MongoClient(process.env.MONGODB_URI?.trim(), { serverSelectionTimeoutMS: 5000 });
let database;

async function connectDatabase() {
  if (database) return database;
  await mongoClient.connect();
  database = mongoClient.db(process.env.MONGODB_DATABASE || undefined);
  await Promise.all([
    database.collection('applications').createIndex({ id: 1 }, { unique: true }),
    database.collection('applications').createIndex({ status: 1, updated_at: -1 }),
    database.collection('audit_events').createIndex({ application_id: 1, created_at: -1 }),
  ]);
  return database;
}

function json(response, status, body) {
  if (response.writableEnded) return;
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  response.end(JSON.stringify(body));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let bytes = 0;
    request.on('data', (chunk) => {
      bytes += chunk.length;
      if (bytes > MAX_FILE_BYTES) {
        reject(new Error('Request body exceeds 5MB.'));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error('Invalid JSON body.'));
      }
    });
    request.on('error', reject);
  });
}

function normalizeApplication(application) {
  if (!application || typeof application !== 'object' || !application.id) {
    throw new Error('Each application requires an id.');
  }
  const { _id, ...data } = application;
  return {
    ...data,
    status: data.status || 'Draft',
    kycData: data.kycData || {},
    documentVerification: data.documentVerification || {},
    timeline: Array.isArray(data.timeline) ? data.timeline : [],
  };
}

async function saveApplication(db, application, actor = 'Nile Pay') {
  const applications = db.collection('applications');
  const auditEvents = db.collection('audit_events');
  const normalized = normalizeApplication(application);
  const previous = await applications.findOne({ id: normalized.id });
  const now = new Date().toISOString();
  const saved = {
    ...normalized,
    created_at: previous?.created_at || normalized.created_at || now,
    updated_at: now,
  };

  if (saved.status !== 'Draft' && saved.status !== 'Rejected') {
    const email = saved.kycData?.email?.trim().toLowerCase();
    const bvn = saved.kycData?.bvn?.trim();
    const rcNumber = saved.kycData?.rcNumber?.trim();
    const taxId = saved.kycData?.taxId?.trim();

    const query = {
      id: { $ne: saved.id },
      status: { $in: ['Submitted', 'Under Review', 'Approved', 'Account Created', 'Payment Activated', 'More Info Required'] }
    };

    const duplicateCursor = applications.find(query);
    for await (const app of duplicateCursor) {
      if (email && app.kycData?.email?.trim().toLowerCase() === email) {
        throw new Error(`Email address (${email}) is already registered under another active merchant profile.`);
      }
      if (bvn && app.kycData?.bvn?.trim() === bvn) {
        throw new Error(`Bank Verification Number (BVN) is already registered under another active merchant profile.`);
      }
      if (rcNumber && app.kycData?.rcNumber?.trim() === rcNumber) {
        throw new Error(`Registration Number / CAC RC Number (${rcNumber}) is already registered under another active merchant profile.`);
      }
      if (taxId && app.kycData?.taxId?.trim() === taxId) {
        throw new Error(`Tax Identification Number (TIN) is already registered under another active merchant profile.`);
      }
    }
  }

  await applications.updateOne({ id: saved.id }, { $set: saved }, { upsert: true });

  const events = [];
  if (!previous) {
    events.push({ event_type: 'application.created', payload: { status: saved.status } });
  } else {
    if (previous.status !== saved.status) {
      events.push({
        event_type: 'application.status_changed',
        payload: { from: previous.status, to: saved.status },
      });
    }
    if (JSON.stringify(previous.documentVerification || {}) !== JSON.stringify(saved.documentVerification)) {
      events.push({
        event_type: 'document.review_updated',
        payload: { documentVerification: saved.documentVerification },
      });
    }
  }
  if (events.length) {
    await auditEvents.insertMany(events.map((event) => ({
      application_id: saved.id,
      actor,
      created_at: now,
      ...event,
    })));
  }
  return saved;
}

function routeMatch(pathname, expression) {
  const match = pathname.match(expression);
  return match ? match.slice(1).map(decodeURIComponent) : null;
}

function uploadDocument(request, response) {
  return new Promise((resolve) => {
    let settled = false;
    let fileSeen = false;
    const finish = (status, body) => {
      if (settled) return;
      settled = true;
      json(response, status, body);
      resolve();
    };

    let busboy;
    try {
      busboy = Busboy({
        headers: request.headers,
        limits: { files: 1, fileSize: MAX_FILE_BYTES, fields: 0 },
      });
    } catch (error) {
      finish(400, { error: error.message });
      return;
    }

    busboy.on('file', (_field, file, info) => {
      fileSeen = true;
      if (!ALLOWED_FILE_TYPES.has(info.mimeType)) {
        file.resume();
        finish(415, { error: 'Only PDF, PNG, and JPEG documents are accepted.' });
        return;
      }

      const safeName = info.filename.replace(/[^a-zA-Z0-9_.-]/g, '_') || 'document';
      let tooLarge = false;
      file.on('limit', () => {
        tooLarge = true;
      });

      const uploadStream = cloudinary.uploader.upload_stream({
        folder: 'nilepay/compliance-documents',
        resource_type: 'auto',
        public_id: `${randomUUID()}-${safeName}`,
        use_filename: false,
      }, (error, result) => {
        if (tooLarge) {
          if (result?.public_id) {
            cloudinary.uploader.destroy(result.public_id, { resource_type: result.resource_type }).catch(() => {});
          }
          finish(413, { error: 'Document exceeds the 5MB size limit.' });
          return;
        }
        if (error) {
          finish(502, { error: 'Cloudinary upload failed.' });
          return;
        }

        const downloadUrl = result.secure_url.replace('/upload/', '/upload/fl_attachment/');
        finish(201, {
          name: info.filename,
          type: info.mimeType,
          bytes: result.bytes,
          size: `${(result.bytes / (1024 * 1024)).toFixed(1)}MB`,
          url: result.secure_url,
          downloadUrl,
          publicId: result.public_id,
          resourceType: result.resource_type,
          uploadedAt: result.created_at,
        });
      });
      file.pipe(uploadStream);
    });

    busboy.on('filesLimit', () => finish(400, { error: 'Only one document can be uploaded at a time.' }));
    busboy.on('error', (error) => finish(400, { error: error.message }));
    busboy.on('finish', () => {
      if (!fileSeen) finish(400, { error: 'No document was provided.' });
    });
    request.pipe(busboy);
  });
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    response.end();
    return;
  }

  try {
    const db = await connectDatabase();
    const applications = db.collection('applications');

    if (request.method === 'GET' && url.pathname === '/api/health') {
      await db.command({ ping: 1 });
      return json(response, 200, {
        ok: true,
        service: 'nilepay-compliance-api',
        database: 'connected',
        cloudinary: 'configured',
      });
    }

    if (request.method === 'POST' && url.pathname === '/api/upload') {
      return uploadDocument(request, response);
    }

    if (request.method === 'POST' && url.pathname === '/api/bootstrap') {
      try {
        const body = await readJson(request);
        if (!Array.isArray(body.applications)) throw new Error('applications must be an array.');
        const saved = [];
        for (const application of body.applications) {
          saved.push(await saveApplication(db, application, 'Bootstrap'));
        }
        return json(response, 200, { applications: saved });
      } catch (err) {
        return json(response, 400, { error: err.message });
      }
    }

    if (request.method === 'POST' && url.pathname === '/api/admin/verify') {
      try {
        const body = await readJson(request);
        const expected = process.env.ADMIN_PASSCODE || '878787';
        if (String(body.passcode) === String(expected)) {
          return json(response, 200, { success: true });
        } else {
          return json(response, 401, { error: 'Invalid compliance passcode.' });
        }
      } catch (err) {
        return json(response, 400, { error: err.message });
      }
    }

    if (request.method === 'GET' && url.pathname === '/api/applications') {
      const records = await applications.find({}).sort({ updated_at: -1 }).toArray();
      return json(response, 200, { applications: records });
    }

    const applicationRoute = routeMatch(url.pathname, /^\/api\/applications\/([^/]+)$/);
    const auditRoute = routeMatch(url.pathname, /^\/api\/applications\/([^/]+)\/audit$/);

    if (request.method === 'GET' && auditRoute) {
      const events = await db.collection('audit_events')
        .find({ application_id: auditRoute[0] })
        .sort({ created_at: -1 })
        .toArray();
      return json(response, 200, { events });
    }

    if (request.method === 'GET' && applicationRoute) {
      const application = await applications.findOne({ id: applicationRoute[0] });
      return application
        ? json(response, 200, { application })
        : json(response, 404, { error: 'Application not found.' });
    }

    if (request.method === 'PUT' && url.pathname === '/api/applications') {
      const body = await readJson(request);
      if (!Array.isArray(body.applications)) throw new Error('applications must be an array.');
      const saved = [];
      for (const application of body.applications) {
        saved.push(await saveApplication(db, application, body.actor));
      }
      return json(response, 200, { applications: saved });
    }

    if (request.method === 'PUT' && applicationRoute) {
      const body = await readJson(request);
      const saved = await saveApplication(
        db,
        { ...(body.application || body), id: applicationRoute[0] },
        body.actor,
      );
      return json(response, 200, { application: saved });
    }

    return json(response, 404, { error: 'API route not found.' });
  } catch (error) {
    console.error(error);
    return json(response, 500, { error: error.message || 'Unexpected server error.' });
  }
});

console.log('Starting Nile Pay compliance API...');
try {
  console.log('Connecting to database...');
  await connectDatabase();
  console.log('Database connected successfully!');
  server.listen(port, '127.0.0.1', () => {
    console.log(`Nile Pay compliance API listening on http://127.0.0.1:${port}`);
  });
} catch (error) {
  console.error(`Nile Pay API startup failed: ${error.message}`);
  process.exit(1);
}

function shutdown() {
  server.close(async () => {
    await mongoClient.close();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
