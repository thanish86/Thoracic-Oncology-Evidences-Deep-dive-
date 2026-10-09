# Deployment

## Requirements
- Node.js ≥20 (developed on 22), npm.
- PostgreSQL ≥14 (local, Docker, Supabase, Neon, RDS…).

## Local
```bash
cp .env.example .env            # set DATABASE_URL
npm ci
npx prisma migrate deploy       # or: npm run db:migrate
npm run db:seed                 # validates /content, then loads it
npm run dev                     # http://localhost:3000
```
Docker Postgres quick start:
```bash
docker run -d --name oncoatlas-db -e POSTGRES_USER=oncoatlas -e POSTGRES_PASSWORD=oncoatlas -e POSTGRES_DB=oncoatlas -p 5432:5432 postgres:16
```

## Production (e.g. Vercel + Supabase/Neon)
1. Create the database; set `DATABASE_URL` (use the pooled connection string for serverless; add `?pgbouncer=true&connection_limit=1`
   where PgBouncer is used and a `directUrl` for migrations if needed).
2. Set `ADMIN_REVIEW_TOKEN` (≥16 random characters) only on environments where reviewers work; `CONTACT_EMAIL`, optional `NCBI_API_KEY`.
3. Build: `npm ci && npx prisma generate && npm run build`. Run `npx prisma migrate deploy && npm run db:seed` as a release step.
4. Start: `npm run start` (or platform default).

Evidence pages are dynamic and read from Postgres on each request; there is no build-time database dependency.

## Release checklist
- `npm run verify` (content validation, typecheck, lint, unit/integration tests, build) and `npm run test:e2e` pass.
- Migrations reviewed; seed run against staging; spot-check `/admin/evidence` counts.
- No secrets in `NEXT_PUBLIC_*`.
- Medical disclaimer visible (footer) and statuses rendered.

## Not production-ready yet
Authentication/role-based access (Supabase Auth planned), background job runner for scheduled revalidation, regulatory/guideline
ingestion, monitoring and backups are not implemented. See `IMPLEMENTATION_PLAN.md`.
