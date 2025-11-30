# Change: Add PGlite for Zero-Config Local Development

## Why

New users cloning this project must currently set up a Vercel project and Neon database before they can run `bun dev`. This creates significant friction for developers who just want to explore or experiment with the codebase. By using PGlite (WASM-based PostgreSQL), developers can start immediately with `bun dev` - no external services required.

## What Changes

- **BREAKING**: `bun dev` no longer runs the setup wizard or requires Neon/Vercel configuration
- Add PGlite (`@electric-sql/pglite`) as the default local development database
- Create new `bun setup` command for production/preview environment configuration (Vercel, Neon, Resend)
- Add automatic database initialization on first `bun dev` run (applies migrations to PGlite)
- Refactor database client to support both PGlite (local) and Neon (production) drivers
- Update test infrastructure to use PGlite with real database interactions
- Add environment detection to switch between PGlite and Neon based on `DATABASE_URL` presence
- Refactor Better Auth for flexible configuration:
  - Google OAuth enabled when credentials provided, disabled otherwise
  - Magic link always available: sends email via Resend if configured, console.log if not
  - Email/password as fallback when no OAuth configured
  - Deterministic dev secret with warning when `BETTER_AUTH_SECRET` not set
  - Make `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`, `BETTER_AUTH_SECRET` optional

## Impact

- Affected specs: local-development (new capability)
- Affected code:
  - `packages/server/src/db/index.ts` - Database client with driver switching
  - `packages/server/src/env.ts` - Make DATABASE_URL optional for local dev
  - `packages/server/drizzle.config.ts` - Support PGlite driver
  - `packages/tools/setup.ts` - Move to explicit `bun setup` command
  - `package.json` - Update scripts (`dev`, add `setup`, add `db:init`)
  - `packages/api/src/auth.ts` - Local dev mode with email/password auth
  - `packages/api/src/test-setup.ts` - Use real PGlite database
  - `packages/api/src/test-utils/` - Database test helpers
