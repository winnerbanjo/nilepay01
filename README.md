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
a managed MongoDB Atlas database. Uploaded files (passports, CAC certificates, utility bills, etc.) are stored securely in Cloudinary.

## API routes

- `GET /api/health`
- `GET /api/applications`
- `GET /api/applications/:id`
- `PUT /api/applications`
- `PUT /api/applications/:id`
- `GET /api/applications/:id/audit`
- `POST /api/bootstrap`
- `POST /api/upload`

## Build

```bash
npm run build
```

The production environment is configured on Vercel utilizing Serverless Functions, connected to MongoDB Atlas and Cloudinary.

