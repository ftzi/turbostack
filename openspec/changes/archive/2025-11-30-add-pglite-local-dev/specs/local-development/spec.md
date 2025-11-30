## ADDED Requirements

### Requirement: Zero-Config Local Development

The system SHALL allow developers to run `bun dev` immediately after cloning the repository without any external service configuration.

#### Scenario: First-time developer runs bun dev
- **WHEN** a developer clones the repository and runs `bun dev`
- **THEN** the development server starts successfully using PGlite as the database
- **AND** database migrations are applied automatically
- **AND** no Vercel or Neon configuration is required

#### Scenario: PGlite database persists between restarts
- **WHEN** a developer stops and restarts the development server
- **THEN** all previously created data in the local database is preserved
- **AND** the database is stored in the `.pglite/` directory

### Requirement: PGlite Database Driver

The system SHALL use PGlite as the database driver when `DATABASE_URL` environment variable is not set.

#### Scenario: Local development without DATABASE_URL
- **WHEN** `DATABASE_URL` environment variable is not set
- **THEN** the system uses PGlite with file-based persistence in `.pglite/`
- **AND** the Drizzle ORM works identically to Neon

#### Scenario: Production with DATABASE_URL
- **WHEN** `DATABASE_URL` environment variable is set to a Neon connection string
- **THEN** the system uses the Neon serverless driver
- **AND** PGlite is not loaded

### Requirement: Automatic Migration on Development Start

The system SHALL automatically apply pending database migrations when starting in local development mode.

#### Scenario: Fresh PGlite database initialization
- **WHEN** the development server starts with a fresh PGlite database
- **THEN** all migrations from `packages/server/drizzle/` are applied automatically
- **AND** the database schema matches production

#### Scenario: Existing PGlite database with pending migrations
- **WHEN** the development server starts with new migrations not yet applied
- **THEN** only the pending migrations are applied
- **AND** existing data is preserved

### Requirement: Explicit Production Setup Command

The system SHALL provide a `bun setup` command for configuring production/preview environments.

#### Scenario: Running bun setup for production configuration
- **WHEN** a developer runs `bun setup`
- **THEN** the setup wizard guides them through Vercel project linking
- **AND** Neon database integration setup
- **AND** optional Resend email configuration
- **AND** Better Auth secret generation

#### Scenario: Skipping setup for local-only development
- **WHEN** a developer only wants to develop locally
- **THEN** they never need to run `bun setup`
- **AND** `bun dev` works without any prior configuration

### Requirement: Test Database Isolation

The system SHALL use PGlite for automated tests with isolated database instances.

#### Scenario: Unit tests use real database
- **WHEN** running `bun test`
- **THEN** each test file receives a fresh PGlite database instance
- **AND** migrations are applied before tests run
- **AND** tests can perform real database operations

#### Scenario: Test isolation between files
- **WHEN** multiple test files run in parallel
- **THEN** each file has its own isolated database
- **AND** no test pollution occurs between files

### Requirement: Drizzle Kit PGlite Support

The system SHALL support Drizzle Kit operations with PGlite for local development.

#### Scenario: Running drizzle-kit studio locally
- **WHEN** a developer runs `bun db:studio` without DATABASE_URL
- **THEN** Drizzle Studio opens and connects to the local PGlite database

#### Scenario: Generating migrations locally
- **WHEN** a developer modifies the schema and runs `bun db:generate`
- **THEN** Drizzle Kit generates migrations compatible with both PGlite and Neon

### Requirement: Better Auth Flexible Configuration

The system SHALL adapt authentication methods based on available credentials while always providing a working auth flow.

#### Scenario: No credentials configured (zero-config)
- **WHEN** no OAuth or email credentials are set
- **THEN** magic link is available with links logged to console
- **AND** email/password authentication is enabled as fallback
- **AND** a deterministic dev secret is used with a warning logged

#### Scenario: Google OAuth credentials provided
- **WHEN** `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- **THEN** Google OAuth is enabled
- **AND** email/password authentication is disabled
- **AND** magic link remains available

#### Scenario: Resend credentials provided
- **WHEN** `RESEND_API_KEY` is set
- **THEN** magic link emails are sent via Resend
- **AND** magic links are no longer logged to console

#### Scenario: Magic link without Resend
- **WHEN** `RESEND_API_KEY` is not set
- **AND** a user requests a magic link
- **THEN** the magic link URL and token are logged to the console
- **AND** the format includes the email, URL, and token for easy copying

#### Scenario: Better Auth secret not configured
- **WHEN** `BETTER_AUTH_SECRET` is not set
- **THEN** a deterministic development secret is used
- **AND** a warning is logged indicating this is not secure for production

#### Scenario: Full production configuration
- **WHEN** all credentials are configured (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`, `BETTER_AUTH_SECRET`)
- **THEN** Google OAuth is enabled
- **AND** magic link emails are sent via Resend
- **AND** email/password authentication is disabled
