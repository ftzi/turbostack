## Context

This project currently requires users to set up Vercel and Neon before running `bun dev`. This creates a poor developer experience for those who want to quickly explore or prototype. The change introduces PGlite as a zero-configuration local database while preserving Neon for production deployments.

**Stakeholders:** New developers cloning the repo, existing contributors, CI/CD pipelines

**Constraints:**
- Must maintain full PostgreSQL compatibility (PGlite is WASM Postgres)
- Must not break production deployments using Neon
- Must work with existing Drizzle ORM schema and migrations
- Must support both Bun and Node.js runtimes

## Goals / Non-Goals

**Goals:**
- Zero-config local development: `git clone && bun dev` works immediately
- Real PostgreSQL for tests (no more mocked database)
- Clear separation between local dev (PGlite) and production (Neon)
- Preserve existing migration workflow (`bun db:generate`, `bun db:migrate`)

**Non-Goals:**
- Removing Neon support entirely
- Supporting PGlite in production
- Changing the database schema or migration format
- Adding database seeding (can be a future enhancement)

## Decisions

### Decision 1: Use PGlite with file-based persistence

**What:** Store PGlite data in `.pglite/` directory (gitignored)
**Why:** Persists data between dev server restarts; in-memory would lose all data on restart
**Alternatives considered:**
- In-memory only: Simpler but loses data on every restart - poor DX for development
- IndexedDB: Browser-only, not applicable to Node.js/Bun server

### Decision 2: Environment-based driver selection

**What:** Check for `DATABASE_URL` environment variable to determine which driver to use
**Why:** Simple, explicit, works with existing env var patterns
**Implementation:**
```typescript
// packages/server/src/db/index.ts
const isPglite = !process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("pglite:")

if (isPglite) {
  // Use drizzle-orm/pglite
} else {
  // Use drizzle-orm/neon-http
}
```

**Alternatives considered:**
- `NODE_ENV` based: Less explicit, doesn't distinguish between dev with/without Neon
- Separate env var `USE_PGLITE`: Extra configuration burden

### Decision 3: Auto-run migrations on dev startup

**What:** Check if PGlite database needs migrations and apply them automatically
**Why:** Eliminates manual `bun db:migrate` step for local development
**Implementation:** Run migrations programmatically using `drizzle-orm/pglite/migrator`

**Alternatives considered:**
- Require manual migration: Adds friction, defeats zero-config goal
- Schema push on every start: Slower, may cause data loss

### Decision 4: Tests use PGlite with fresh database per test file

**What:** Each test file gets a fresh in-memory PGlite instance
**Why:** Tests are isolated, fast, and use real database interactions
**Implementation:**
```typescript
// test-setup.ts
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import { migrate } from 'drizzle-orm/pglite/migrator'

const client = new PGlite()
export const testDb = drizzle(client)
await migrate(testDb, { migrationsFolder: './drizzle' })
```

**Alternatives considered:**
- Shared PGlite instance: Risk of test pollution
- Keep mocks: Miss real database bugs, harder to maintain

### Decision 5: Rename `bun dev` setup behavior to explicit `bun setup`

**What:** Move Vercel/Neon setup wizard to `bun setup` command
**Why:** Separates "I want to develop locally" from "I want to deploy"
**Commands after change:**
- `bun dev` - Start development (uses PGlite, no config needed)
- `bun setup` - Configure Vercel, Neon, Resend for deployments
- `bun db:migrate` - Run migrations (works with both PGlite and Neon)

### Decision 6: Better Auth flexible configuration

**What:** Make auth configuration adapt to available credentials while always providing a working auth flow
**Why:** Users should be able to start immediately, but also use Google OAuth / Resend if they configure them

**Principles:**
1. **Google OAuth**: Enabled if credentials provided, disabled otherwise
2. **Magic link**: Always available - emails via Resend if configured, console.log if not
3. **Email/password**: Fallback when no other auth method is available
4. **Secret**: Use provided secret, or deterministic dev secret with warning

**Implementation:**
```typescript
// packages/api/src/auth.ts - flexible configuration
const hasGoogleOAuth = serverEnv.GOOGLE_CLIENT_ID && serverEnv.GOOGLE_CLIENT_SECRET
const hasResend = serverEnv.RESEND_API_KEY
const hasSecret = serverEnv.BETTER_AUTH_SECRET
const isLocalDev = !process.env.DATABASE_URL

// Warn if using dev secret
if (!hasSecret) {
  console.warn("⚠️  BETTER_AUTH_SECRET not set - using dev secret (not secure for production)")
}

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", usePlural: true }),

  secret: serverEnv.BETTER_AUTH_SECRET ?? "dev-secret-do-not-use-in-production",

  // Google OAuth: enabled if credentials provided
  socialProviders: hasGoogleOAuth ? {
    google: {
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
    },
  } : {},

  // Email/password: fallback when no OAuth available
  emailAndPassword: {
    enabled: !hasGoogleOAuth,
  },

  plugins: [
    // Magic link always available - delivery method varies
    magicLink({
      sendMagicLink: async ({ email, token, url }) => {
        if (hasResend) {
          // Send via Resend
          await emailSender.sendEmail({ to: email, ... })
        } else {
          // Console log for local development
          console.log(`\n🔗 Magic link for ${email}:\n   ${url}\n   Token: ${token}\n`)
        }
      },
    }),
    nextCookies(),
  ],
})
```

**Auth availability matrix:**

| Credentials Set | Google OAuth | Magic Link | Email/Password |
|-----------------|--------------|------------|----------------|
| None            | ❌           | ✅ (console) | ✅ (fallback)  |
| Google only     | ✅           | ✅ (console) | ❌             |
| Resend only     | ❌           | ✅ (email)   | ✅ (fallback)  |
| Google + Resend | ✅           | ✅ (email)   | ❌             |

**Alternatives considered:**
- Disable magic link without Resend: Loses useful auth method for local testing
- Always enable email/password: Diverges from production behavior when OAuth is available

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| PGlite missing PostgreSQL features | PGlite supports most features; test critical queries in CI with real Postgres if needed |
| Different behavior between PGlite and Neon | Same Drizzle schema/migrations; PGlite uses real Postgres engine |
| Larger dependency footprint (~3MB gzipped) | Only included in dev dependencies, not in production bundle |
| Test migrations may get out of sync | CI validates migrations work; same migration files for both |

## Migration Plan

1. Add PGlite packages and database driver abstraction
2. Update env validation to make `DATABASE_URL` optional
3. Create `bun setup` command from existing setup script
4. Update `bun dev` to use PGlite and auto-migrate
5. Refactor test setup to use PGlite
6. Update documentation (CLAUDE.md, README if exists)

**Rollback:** If issues arise, users can run `bun setup` to configure Neon and set `DATABASE_URL` to use the old behavior.

## Open Questions

None - the design is straightforward given PGlite's full PostgreSQL compatibility.

## References

- PGlite Documentation: https://pglite.dev/docs/about
- Drizzle + PGlite: https://pglite.dev/docs/orm-support
- Drizzle Kit PGlite config: https://orm.drizzle.team/docs/connect-pglite
