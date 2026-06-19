import http from 'node:http';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const here = dirname(fileURLToPath(import.meta.url));
const dataDirectory = resolve(here, 'data');
mkdirSync(dataDirectory, { recursive: true });

const databasePath = process.env.NILEPAY_DATABASE_PATH || resolve(dataDirectory, 'nilepay.sqlite');
const port = Number(process.env.API_PORT || 8787);
const db = new DatabaseSync(databasePath);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    status TEXT NOT NULL,
    account_type TEXT,
    country TEXT,
    submitted_date TEXT,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS audit_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    actor TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS applications_status_idx ON applications(status);
  CREATE INDEX IF NOT EXISTS applications_country_idx ON applications(country);
  CREATE INDEX IF NOT EXISTS audit_application_idx ON audit_events(application_id, created_at);
`);

const selectApplication = db.prepare('SELECT data FROM applications WHERE id = ?');
const selectApplications = db.prepare('SELECT data FROM applications ORDER BY updated_at DESC');
const selectApplicationMeta = db.prepare('SELECT status, data FROM applications WHERE id = ?');
const countApplications = db.prepare('SELECT COUNT(*) AS count FROM applications');
const upsertApplication = db.prepare(`
  INSERT INTO applications (id, data, status, account_type, country, submitted_date, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET
    data = excluded.data,
    status = excluded.status,
    account_type = excluded.account_type,
    country = excluded.country,
    submitted_date = excluded.submitted_date,
    updated_at = excluded.updated_at
`);
const insertAudit = db.prepare(`
  INSERT INTO audit_events (application_id, event_type, actor, payload, created_at)
  VALUES (?, ?, ?, ?, ?)
`);
const selectAudit = db.prepare(`
  SELECT id, event_type AS eventType, actor, payload, created_at AS createdAt
  FROM audit_events
  WHERE application_id = ?
  ORDER BY id DESC
`);

function json(response, status, body) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(body));
}

function readJson(request) {
  return new Promise((resolveBody, reject) => {
    let raw = '';
    request.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 5_000_000) reject(new Error('Request body exceeds 5MB.'));
    });
    request.on('end', () => {
      try {
        resolveBody(raw ? JSON.parse(raw) : {});
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
  return {
    ...application,
    status: application.status || 'Draft',
    kycData: application.kycData || {},
    documentVerification: application.documentVerification || {},
    timeline: Array.isArray(application.timeline) ? application.timeline : [],
  };
}

function saveApplication(application, actor = 'System sync') {
  const normalized = normalizeApplication(application);
  const previousRow = selectApplicationMeta.get(normalized.id);
  const previousApplication = previousRow ? JSON.parse(previousRow.data) : null;
  const now = new Date().toISOString();

  upsertApplication.run(
    normalized.id,
    JSON.stringify(normalized),
    normalized.status,
    normalized.accountType || null,
    normalized.country || normalized.kycData?.country || null,
    normalized.submittedDate || null,
    now,
  );

  if (!previousRow) {
    insertAudit.run(normalized.id, 'application.created', actor, JSON.stringify({ status: normalized.status }), now);
  } else if (previousRow.status !== normalized.status) {
    insertAudit.run(
      normalized.id,
      'application.status_changed',
      actor,
      JSON.stringify({ from: previousRow.status, to: normalized.status }),
      now,
    );
  }

  if (previousApplication) {
    const previousDocuments = JSON.stringify(previousApplication.documentVerification || {});
    const currentDocuments = JSON.stringify(normalized.documentVerification || {});
    if (previousDocuments !== currentDocuments) {
      insertAudit.run(
        normalized.id,
        'document.review_updated',
        actor,
        JSON.stringify({ documentVerification: normalized.documentVerification }),
        now,
      );
    }

    const previousTimelineLength = previousApplication.timeline?.length || 0;
    const addedEvents = normalized.timeline.slice(previousTimelineLength);
    addedEvents.forEach((event) => {
      insertAudit.run(
        normalized.id,
        'timeline.event_added',
        event.user || actor,
        JSON.stringify(event),
        now,
      );
    });
  }

  return normalized;
}

function routeMatch(pathname, expression) {
  const match = pathname.match(expression);
  return match ? match.slice(1).map(decodeURIComponent) : null;
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === 'GET' && url.pathname === '/api/health') {
    return json(response, 200, { ok: true, service: 'nilepay-compliance-api', database: databasePath });
  }

  if (request.method === 'GET' && url.pathname === '/api/applications') {
    const applications = selectApplications.all().map((row) => JSON.parse(row.data));
    return json(response, 200, { applications });
  }

  const applicationRoute = routeMatch(url.pathname, /^\/api\/applications\/([^/]+)$/);
  if (request.method === 'GET' && applicationRoute) {
    const row = selectApplication.get(applicationRoute[0]);
    return row
      ? json(response, 200, { application: JSON.parse(row.data) })
      : json(response, 404, { error: 'Application not found.' });
  }

  const auditRoute = routeMatch(url.pathname, /^\/api\/applications\/([^/]+)\/audit$/);
  if (request.method === 'GET' && auditRoute) {
    const events = selectAudit.all(auditRoute[0]).map((event) => ({
      ...event,
      payload: JSON.parse(event.payload),
    }));
    return json(response, 200, { events });
  }

  try {
    if (request.method === 'POST' && url.pathname === '/api/bootstrap') {
      const existingCount = countApplications.get().count;
      if (existingCount > 0) {
        const applications = selectApplications.all().map((row) => JSON.parse(row.data));
        return json(response, 200, { applications, bootstrapped: false });
      }

      const body = await readJson(request);
      const applications = Array.isArray(body.applications) ? body.applications : [];
      db.exec('BEGIN');
      try {
        applications.forEach((application) => saveApplication(application, 'Demo bootstrap'));
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
      return json(response, 201, { applications, bootstrapped: true });
    }

    if (request.method === 'PUT' && url.pathname === '/api/applications') {
      const body = await readJson(request);
      if (!Array.isArray(body.applications)) throw new Error('applications must be an array.');

      db.exec('BEGIN');
      try {
        body.applications.forEach((application) => saveApplication(application, body.actor || 'Nile Pay app'));
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }

      return json(response, 200, { applications: body.applications });
    }

    if (request.method === 'PUT' && applicationRoute) {
      const body = await readJson(request);
      const application = saveApplication({ ...body.application, id: applicationRoute[0] }, body.actor || 'Nile Pay app');
      return json(response, 200, { application });
    }
  } catch (error) {
    return json(response, 400, { error: error.message });
  }

  return json(response, 404, { error: 'Route not found.' });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Nile Pay compliance API listening on http://127.0.0.1:${port}`);
});

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
