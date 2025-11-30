## 1. Add PGlite Dependencies

- [ ] 1.1 Add `@electric-sql/pglite` to `packages/server/package.json` dependencies
- [ ] 1.2 Add `.pglite/` to root `.gitignore`
- [ ] 1.3 Run `bun install` to install new dependencies

## 2. Create Database Driver Abstraction

- [ ] 2.1 Create `packages/server/src/db/pglite.ts` with PGlite client initialization
- [ ] 2.2 Rename `packages/server/src/db/index.ts` to `packages/server/src/db/neon.ts`
- [ ] 2.3 Create new `packages/server/src/db/index.ts` that switches between drivers based on `DATABASE_URL`
- [ ] 2.4 Export unified `db` instance that works with both drivers

## 3. Update Environment Configuration

- [ ] 3.1 Make `DATABASE_URL` optional in `packages/server/src/env.ts` (required only when not using PGlite)
- [ ] 3.2 Make `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` optional (required only when not using PGlite)
- [ ] 3.3 Make `RESEND_API_KEY` optional (required only when not using PGlite)
- [ ] 3.4 Make `BETTER_AUTH_SECRET` optional with dev fallback
- [ ] 3.5 Add `PGLITE_DIR` optional env var for custom PGlite data directory (defaults to `.pglite/`)

## 4. Update Drizzle Kit Configuration

- [ ] 4.1 Update `packages/server/drizzle.config.ts` to support both PGlite and Neon
- [ ] 4.2 Add conditional driver selection based on `DATABASE_URL` presence

## 5. Create Auto-Migration Script

- [ ] 5.1 Create `packages/tools/db-init.ts` script that:
  - Checks if using PGlite (no DATABASE_URL)
  - Initializes PGlite database if needed
  - Applies pending migrations using Drizzle migrator
- [ ] 5.2 Add `db:init` script to root `package.json` that runs `db-init.ts`

## 6. Refactor Setup Scripts

- [ ] 6.1 Rename current setup behavior to `packages/tools/setup-production.ts`
- [ ] 6.2 Create minimal `packages/tools/setup-dev.ts` that only runs `db:init` if needed
- [ ] 6.3 Update root `package.json`:
  - Change `dev` script to: `bun ./packages/tools/setup-dev.ts && bun i && turbo dev tsw`
  - Add `setup` script: `bun ./packages/tools/setup-production.ts`

## 7. Refactor Better Auth for Flexible Configuration

- [ ] 7.1 Refactor `packages/api/src/auth.ts` to check credential availability
- [ ] 7.2 Enable Google OAuth conditionally (only when credentials provided)
- [ ] 7.3 Enable email/password as fallback (only when no OAuth available)
- [ ] 7.4 Refactor magic link to console.log when RESEND_API_KEY not set
- [ ] 7.5 Use deterministic dev secret with warning when BETTER_AUTH_SECRET not set
- [ ] 7.6 Remove throw statements for missing email sender config
- [ ] 7.7 Create email sender conditionally (only when RESEND_API_KEY present)

## 8. Update Test Infrastructure

- [ ] 8.1 Update `packages/api/src/test-setup.ts` to use real PGlite database
- [ ] 8.2 Create `packages/api/src/test-utils/test-db.ts` with:
  - Fresh PGlite instance creation
  - Migration runner for tests
  - Database cleanup helpers
- [ ] 8.3 Update test helpers in `packages/api/src/test-utils/helpers.ts` to use real db
- [ ] 8.4 Remove database mocks from `test-setup.ts` (keep auth mocks)
- [ ] 8.5 Update existing tests to use real database operations

## 9. Update Documentation

- [ ] 9.1 Update `CLAUDE.md`:
  - Document new `bun dev` zero-config behavior
  - Document `bun setup` for production configuration
  - Update database commands section
  - Add PGlite-specific notes
- [ ] 9.2 Update `openspec/project.md` to reflect PGlite as local database

## 10. Validation

- [ ] 10.1 Run `bun ok` to verify type checking and linting pass
- [ ] 10.2 Run `bun test` to verify all tests pass with PGlite
- [ ] 10.3 Test fresh clone workflow: delete `.pglite/`, run `bun dev`, verify it works
- [ ] 10.4 Test production setup: run `bun setup` and verify Neon configuration works
