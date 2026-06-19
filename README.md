# Nile Pay

Merchant card-payment onboarding and compliance review for the Nile app.

## Run locally

```bash
npm install
npm run dev
```

This starts both services:

- Web app: `http://localhost:5173`
- Compliance API: `http://127.0.0.1:8787`
- Compliance console: `http://localhost:5173/admin/compliance`

The API persists complete application records and audit events in
`server/data/nilepay.sqlite`. The database is created automatically and is
excluded from version control.

## API routes

- `GET /api/health`
- `GET /api/applications`
- `GET /api/applications/:id`
- `PUT /api/applications`
- `PUT /api/applications/:id`
- `GET /api/applications/:id/audit`
- `POST /api/bootstrap`

## Build

```bash
npm run build
```

The current backend is intended for local product development. Before public
deployment, add authenticated sessions and role-based permissions, encrypted
object storage for uploaded documents, secrets management, database backups,
and a managed production database.
