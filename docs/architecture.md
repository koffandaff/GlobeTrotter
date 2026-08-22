# Architecture

Monorepo layout with two **self-contained apps** (no npm workspaces, no shared
packages) so frontend and backend can be deployed independently:

```text
apps/
  express/    Express + TypeScript API (PostgreSQL via Prisma)
  frontend/   Next.js 16 app
```

Each app owns its own package.json, lockfile, tsconfig, ESLint config, and
.env. Root-level scripts are convenience wrappers only.

## Backend (`apps/express`)

Modular / feature-based. Business features live in `src/modules/<feature>/` with the
convention:

```text
modules/<feature>/
  <feature>.routes.ts
  <feature>.controller.ts
  <feature>.service.ts
  <feature>.repository.ts
  <feature>.schema.ts
  <feature>.types.ts
  <feature>.constants.ts
  index.ts
```

Cross-cutting concerns live in `src/core/` (auth, errors, http, logger,
middleware, rbac). Generic, feature-agnostic code lives in `src/shared/`.
Prisma schema and migrations live in `prisma/`.

## Frontend (`apps/frontend`)

App Router routes in `app/` with route groups `(auth)` and `(dashboard)`.
Feature code lives in `features/<feature>/`:

```text
features/<feature>/
  components/
  hooks/
  api/
  schemas/
  types.ts
  constants.ts
```

## Deployment

Each app deploys standalone:

- **Frontend:** Vercel — set root directory to `apps/frontend`.
- **Backend:** any Node host — working directory `apps/express`
  (`npm install` runs `prisma generate` via `postinstall`, then
  `npm run build && npm run start`).
