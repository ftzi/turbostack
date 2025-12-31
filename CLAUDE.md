# Turbostack Development Guide

---

# 1. Meta & Maintenance

## About This File

**Keyword Usage:** When writing or updating specification files, CLAUDE.md, project.md, or other instructional files, use **MUST** and **NEVER** keywords to enforce critical requirements. These keywords signal mandatory behavior that AI agents must follow without exception.

**File Maintenance:** If you discover any information in this file that is no longer accurate or has become outdated, update it immediately to reflect the current state of the codebase.

**README Sync:** README.md MUST be kept in sync with the project. When changing features, workflows, or conventions, update README.md to reflect those changes.

## When to Update This File

Update CLAUDE.md when you make changes that affect:

- **Architecture & Structure**: Monorepo organization, new workspaces, routing patterns, data flow
- **Development Workflow**: New commands, build process changes, testing setup
- **Key Patterns & Conventions**: Environment variables, authentication, API patterns, file organization
- **Tool & Library Migrations**: Package manager changes, major dependency updates, framework migrations
- **Configuration Changes**: TypeScript, Biome, or build tool configurations that affect how developers work

Do NOT update for:

- Individual bug fixes or routine component additions
- Code-level details that can be read from files
- Temporary workarounds or one-off solutions
- Generic best practices unrelated to this specific project

Keep entries brief and structural. Focus on "why" and "how the pieces fit together", not "what's in each file".

---

# 2. Quick Start

## Project Overview

Turbostack is a monorepo based on shadcn and NextStack templates. It uses Turborepo for build orchestration, Bun as the package manager, Next.js for the web app, and includes a shared UI component library.

## Common Commands

### Development

- `bun dev` - Zero-config start: initializes PGlite database, installs dependencies, starts dev server
- `bun setup` - Production setup wizard: configure Vercel, Neon, Resend for deployments
- `bun tsw` - Run TypeScript in watch mode across all workspaces

### Type Checking & Linting

- `bun ts` - Type check all workspaces with TypeScript
- `bun lint` - Format and lint with Biome across all workspaces
- `bun ok` - Run both ts and lint (quick verification)
- `bun test` - Run all tests (delegates to packages/api)
- `bun knip` - Find unused files, dependencies, and exports (Reference: https://knip.dev)
  - Note: Knip may report infrastructure files (auth-client.ts, orpc/client.ts, etc.) as unused until features are built
  - Review Knip output carefully - not all reports are actionable

### Building

- `bun build` - Build all apps and packages

### Database (Drizzle ORM)

- `bun db:init` - Initialize PGlite database and apply migrations (runs automatically with `bun dev`)
- `bun db:studio` - Open Drizzle Studio (works with both PGlite and Neon)
- `bun db:generate` - Generate database migrations (delegates to packages/server)
- `bun db:migrate` - Run database migrations (delegates to packages/server)
- Configuration and migrations live in `packages/server/` where the database code is
- **Local development uses PGlite** (WASM PostgreSQL) - no external database needed
- **Production uses Neon** - set `DATABASE_URL` to switch

### Environment Variables

- `bun env` - Pull environment variables from Vercel

### Web App Specific (in apps/web/)

- `bun dev` - Start Next.js dev server with Turbopack
- `bun build` - Build the Next.js app
- `bun ts` - Type check web app
- `bun tsw` - TypeScript watch mode for web app
- `bun lint` - Format and lint with Biome (auto-fix enabled)
- `bun lint:dry` - Check formatting and linting without auto-fix

## Essential Tech Stack

- **Package Manager:** Always use `bun` instead of npm/yarn/pnpm
- **Node Version:** Requires Node.js >= 20
- **React Version:** Uses React 19.2.0 (latest)
- **Next.js Version:** Uses Next.js 16 with App Router
- **Route Groups:** Next.js routes use parentheses for grouping (e.g., `(home)/page.tsx`)
- **Server Components:** Default to Server Components; use `"use client"` directive only when needed
- **Import Paths:** Use workspace aliases (`@workspace/ui`, `@workspace/typescript-config`, etc.)
- **Local Database:** PGlite (WASM PostgreSQL) stored in `.pglite/` - auto-created on first `bun dev`
- **Production Database:** Neon serverless - configure via `bun setup` or set `DATABASE_URL`
- **Authentication:** Flexible - Google OAuth if credentials provided, email/password fallback otherwise
- **API Routes with JSX:** Use `.tsx` extension for API routes that contain JSX (required for Biome formatting)

---

# 3. Development Workflow

## Quality Verification

- **ALWAYS run `bun ok` after finishing any task or when facing issues**
- This command runs type checking, linting, and tests across the entire codebase
- A task is NOT complete until `bun ok` passes fully
- **CRITICAL: `bun ok` MUST ALWAYS be run from the project root directory**
  - NEVER run it from subdirectories like `apps/web` or `packages/*`
  - Always navigate to the root first: `cd <project-root> && bun ok`
  - This is a Turborepo monorepo - the command must run from root to check all packages
- **ALWAYS use `bun ok`** for type checking and linting - never use `bun ts`, `bun lint`, or `tsc` directly
- **NEVER run `tsc` directly** - not even for single files - always use `bun ok`

## Test Requirements

- **Unit tests are REQUIRED** - Always add unit tests when adding or modifying functions/utilities
- **Post-task test verification** - After completing any task, verify test coverage for changed files:
  - Modified behavior → Update affected tests to match
  - New functionality → Add tests for it
  - Tests must catch regressions to enable confident iteration
- **No Manual Tests** - Never include manual verification tasks in OpenSpec proposals or task lists. All validation must be automated (`bun ok`, automated tests, etc.). Manual browser testing, viewport testing, and similar human-required verification steps are forbidden.
- Test files should be co-located with source files (e.g., `handler.ts` → `handler.test.ts`)
- Run `bun test` to execute all unit tests
- NEVER use `timeout` parameters when running tests - trust the test framework's default timeout behavior

## Development Server

- **IMPORTANT: Never run `bun dev` or `next dev` directly** - The dev server causes lock file issues and port conflicts
  - For e2e tests: Use `bun e2e` which starts the dev server automatically via Playwright's webServer config
  - For manual testing: Ask the user to run the dev server themselves
- Do NOT attempt to run development servers - they're already running and not accessible to Claude Code
- Do NOT try to call API endpoints - you don't have authentication access
- NEVER use `sleep` commands - they are unnecessary and wasteful

## Database Operations

- **NEVER run Drizzle Kit commands directly** - `bun db:generate`, `drizzle-kit generate`, `drizzle-kit migrate`, etc. require interactive input
- After making schema changes, ALWAYS prompt the user to run `bun db:generate` manually
- Format: "Schema changes complete. Please run: `bun db:generate`"
- Never attempt to run these commands - they need user interaction for table renames/drops

## Git Operations

**NEVER commit or push code** - All git operations must be explicitly requested by the user:
- Do NOT run `git add`, `git commit`, or `git push`
- NEVER run `git stash` or `git stash pop` - do not hide or restore changes without explicit instruction
- The user handles all git operations manually

## Tools & Integration

**MCP Servers:** This repository uses `.mcp.json` for team-wide MCP server configuration:
- **better-auth** - Better Auth documentation and assistance
- **next-devtools** - Next.js 16 debugging and diagnostics
- **context7** - Library documentation and code generation
- Team members will be prompted to trust these servers on first use

**Context7 Integration:**
- Always use context7 when I need code generation, setup or configuration steps, or library/API documentation
- This means you should automatically use the Context7 MCP tools to resolve library id and get library docs without me having to explicitly ask

**Next.js DevTools:**
- When starting work on a Next.js project, ALWAYS call the `init` tool from next-devtools-mcp FIRST to set up proper context and establish documentation requirements
- Do this automatically without being asked

---

# 4. Code Standards

## Code Principles

Follow Clean Code + SOLID + KISS + YAGNI:

- **Clean Code**: Self-documenting, readable code with meaningful names and single responsibility
- **SOLID**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **KISS**: Simplest solution that solves the problem, avoid over-engineering
- **YAGNI**: Don't add functionality until actually needed

## TypeScript Conventions

- **NEVER use `any` type** - Use `unknown` if type is truly unknown, but even that should be avoided
- **NEVER use `as any` assertions** - Find the proper type or use specific type assertions. Use `as unknown` only if absolutely necessary
- **NEVER use `interface`** - Always use `type` instead
- Reuse existing types - don't create duplicate types
- Use Zod schemas for runtime validation when appropriate
- Add comments to object type properties only when not self-explanatory (skip obvious ones like `className`)
- Prefer optional chaining for callbacks: `onComplete?.(data)` instead of `if (onComplete) onComplete(data)`

## Import Conventions

- **NEVER use barrel files** - Barrel files (index.ts files that re-export everything) are forbidden
- **NEVER re-export from external libraries** - Always import directly from the library where it's needed
  - Example: Import `getLogger` from `@orpc/experimental-pino` directly in the file that uses it
  - Do NOT create wrapper functions that just re-export library functions - this adds unnecessary indirection
  - Re-exporting makes it unclear where the actual implementation lives and breaks IDE navigation
- **Always import directly from source files** - Import from the actual file where the code is defined
- Example: Use `import { getErrorMessage } from "@workspace/shared/utils/error"` instead of `import { getErrorMessage } from "@workspace/shared"`
- Package exports should point directly to source files, not to barrel files
- This improves tree-shaking, makes dependencies explicit, and reduces circular dependency issues
- **Avoid dynamic imports** - Prefer static `import` over `await import()`. Only use dynamic imports for genuine code splitting or conditional loading based on runtime conditions.

## Function Parameters

- Prefer object parameters over multiple direct parameters
- Example: `function foo({ name, age }: { name: string; age: number })` instead of `function foo(name: string, age: number)`

## Error Handling

- Always use `getErrorMessage()` from `@workspace/shared/utils/error` for error handling
- NEVER use `catch (error: any)` - use `catch (error)` and let the utility handle type narrowing
- Provide contextual fallback messages: `getErrorMessage(error, "Failed to update user")`
- Example:

```typescript
import { getErrorMessage } from "@workspace/shared/utils/error";

try {
  await someOperation();
} catch (error) {
  const message = getErrorMessage(error, "Operation failed");
  console.error(message);
  toast({ title: message, variant: "destructive" });
}
```

## Comments

- Do NOT add comments explaining what changes you just made
- Only add comments for complex logic that isn't self-evident
- Use JSDoc-style comments for public APIs
- **Always add reference links** when implementing code from documentation or external sources (unless it's common/trivial code)
  - Format: `// Reference: https://example.com/docs/feature`
  - Helps understand implementation decisions and find updated documentation later
  - Example: `// Reference: https://www.better-auth.com/docs/concepts/typescript#inferring-additional-fields`

## Console Logging

- Always stringify objects: `console.log('DEBUG:', JSON.stringify(data, null, 2))`
- Use a common keyword prefix (e.g., `DEBUG:`, `LOG:`) for easy filtering and bulk copying
- **Always clean up debug code** - Remove all console logs and debugging code once the root cause is found

## React Conventions

- **ALWAYS follow the Rules of Hooks**:
  - Only call hooks at the top level - never inside loops, conditions, or nested functions
  - Do not return early if there's a hook later in the component
  - Hooks must be called in the same order every render
- **React 19.2 Usage**:
  - `<Activity mode="hidden">` - Keeps UI mounted but hidden while preserving state (useful for pre-rendering tabs, loading background data)
  - `useEffectEvent()` - Separates event-like logic from reactive Effects when you need fresh props/state without re-triggering the effect (solves stale closure problems)
  - Avoid manual `useMemo`/`useCallback` - React Compiler handles memoization automatically unless profiling shows specific need

## Implementation Standards

- When asked to implement something, implement it FULLY and completely
- NEVER add placeholder comments like "to be implemented later" or "this will be done when API supports it"
- If something cannot be completed, explain why explicitly rather than leaving incomplete code
- **NEVER create documentation files** - No `.md` files, no READMEs, no CHANGELOG files, no migration guides, NOTHING unless explicitly requested
  - This includes: CHANGELOG.md, MIGRATION.md, NOTES.md, GUIDE.md, or any other documentation
  - The only exception: updating existing CLAUDE.md when architecture changes
  - If you want to communicate what changed, tell the user directly - don't create files

---

# 5. Architecture

## Monorepo Structure

This is a Turborepo monorepo with two main workspace types:

- **apps/** - Application projects
  - **web/** - Next.js 16 app (frontend: pages, components, UI)

- **packages/** - Shared packages
  - **api/** - Backend logic (Better Auth, oRPC, contracts)
  - **server/** - Server-only code (database, server consts/env)
  - **email/** - Email templates using react-email
  - **shared/** - Client + server utilities (consts, env validation, error handling)
  - **ui/** - Shared UI component library (shadcn-based)
  - **typescript-config/** - Shared TypeScript configurations

## Package Management

- Uses **Bun 1.3.1** as package manager (defined in package.json)
- Workspace catalog manages shared dependencies (React 19.2.0, TypeScript 5.9.3, Zod 4.1.12, etc.)
- All internal packages use `workspace:*` protocol for dependencies

## Web App (apps/web/)

**Framework:** Next.js 16 with App Router and React Server Components

**Versions & Features:**

- React 19.2.0 with `<Activity>` component, `useEffectEvent()` hook, and View Transitions
- Next.js 16 with DevTools MCP integration for AI-assisted debugging
- React Compiler enabled (`reactCompiler: true`) for automatic component memoization

**Key Patterns:**

- Uses App Router with route groups: `app/(home)/` for public pages
- Client/server separation enforced via `"server-only"` imports
- Environment variables validated with `@t3-oss/env-nextjs` and Zod
- Consts and env vars are split: `consts.ts` (static) + `env.ts` (validated env vars)

**Configuration:**

- `packages/shared/src/consts.ts` - Static app constants (no env validation triggered on import)
- `packages/shared/src/env.ts` - Client-side env vars (`NEXT_PUBLIC_*`) with Zod validation
- `packages/server/src/consts.ts` - Server-only static constants
- `packages/server/src/env.ts` - Server-only env vars (database, API keys) with Zod validation
- Pattern: Feature flags (e.g., `emailEnabled` in `consts.ts`) control which env vars are required via conditional Zod schemas

**Email Integration:**

- Email sending via Resend (configured in `packages/server/src/consts.ts`)
- Email templates in `packages/email/emails/`
- Main email logic in `packages/email/email.tsx`

**Metadata & OpenGraph:**

- OpenGraph utilities in `apps/web/lib/opengraph/` with Zod schema validation
- API route: `app/api/og/route.tsx` - Generates dynamic OG images with 1-hour cache
- API route: `app/api/icon/route.tsx` - Generates dynamic favicons based on theme (`?theme=light|dark`)
- Layout pattern: Import DEFAULT_OPENGRAPH from `@/lib/opengraph/defaults`, spread and override as needed
- Note: Use `.tsx` extension for API routes containing JSX (required for Biome formatting)

**oRPC API (Type-Safe RPC):**

- Uses contract-first pattern with contracts collocated directly with their handlers
- Each procedure domain has its own directory: `procedures/{domain}/{domain}.contract.ts` + `{domain}.handler.ts`
- Main contract in `packages/api/src/orpc/contract/index.ts` composes domain-specific contracts
- Common errors defined in `packages/api/src/orpc/errors.ts` (`UNAUTHORIZED`, `OPERATION_FAILED`)
- All domain contracts import and use `commonErrors` from `errors.ts`
- Middleware throws errors using `ORPCError` API that match contract-defined errors
- Server implementation in `packages/api/src/orpc/` using `implement(contract)`
- Base implementer in `packages/api/src/orpc/base.ts` with logger middleware applied
- Middleware composition: Logger middleware → Auth middleware (Reference: https://orpc.unnoq.com/docs/middleware)
- Procedures access contract paths: `publicProcedure.ping.handler()` or `protectedProcedure.auth.ping.handler()`
- Router uses `.router()` method to enforce contract at runtime in `packages/api/src/orpc/router.ts`
- API route handler: `apps/web/app/api/rpc/[[...rest]]/route.ts` with compression and logging plugins
- Client setup: `apps/web/lib/query.ts` exports `client` (HTTP client) and `orpc` (TanStack Query utils)
- Server-optimized client: `packages/api/src/orpc/server-client.ts` exports `createServerClient()` function
- Better Auth integration via middleware in `packages/api/src/orpc/middleware/auth.ts`
- Pattern: Use `publicProcedure` for public procedures, `protectedProcedure` for authenticated procedures
- **Critical**: Never re-define `.input()` and `.output()` in procedures - contract already defines these
- **Critical**: Always use `.router()` method at root level to enforce contract at runtime

**oRPC Error Handling:**

- Reference: https://orpc.unnoq.com/docs/client/error-handling
- Import error utilities directly: `import { safe, isDefinedError } from "@orpc/client"`
- Use `safe()` to wrap procedure calls: `const [error, data] = await safe(client.auth.updateUser({...}))`
- Use `isDefinedError(error)` to distinguish defined errors from unexpected ones
- All procedures inherit `OPERATION_FAILED` error with `{ message: string }` data
- Keep it simple: Don't create specific error types for each operation
- Frontend validation is automatic via contract schemas - no need for VALIDATION_ERROR types

**TanStack Query Integration:**

- Reference: https://orpc.unnoq.com/docs/integrations/tanstack-query
- Query utils available via `import { orpc } from "@/lib/query"`
- Use `useQuery(orpc.auth.getCurrentUser.queryOptions({}))` for queries
- Use `useMutation(orpc.auth.updateUser.mutationOptions())` for mutations
- **skipToken for conditional queries**: Use `skipToken` instead of `disabled` option
  - Pattern: `input: condition ? { ...data } : skipToken`
  - Reference: https://orpc.unnoq.com/docs/integrations/tanstack-query#skiptoken-for-disabling-queries
  - Example: `useQuery(orpc.user.get.queryOptions({ input: userId ? { userId } : skipToken }))`
  - For infinite queries: Replace entire input function with skipToken when condition is false

**Logging & Monitoring:**

- Pino logger with structured logging and request tracking
- Logger available globally: `import { logger } from "@workspace/api/logger"`
- Logger in procedures: Access via `context.logger?.info("message")` - no imports needed
  - Logger is lazy-loaded and cached on first access via middleware
  - Available in all procedures: `os` and `authorized`
- Compression plugin reduces response sizes for better performance
- Development: Use `pino-pretty` for human-readable logs (configured automatically)
- Production: JSON logs for structured logging and log aggregation

**oRPC Testing:**

- Reference: https://orpc.unnoq.com/docs/advanced/testing-mocking
- Uses Bun's built-in test runner (no additional dependencies needed)
- Test files colocated with handlers: `{handler-name}.test.ts` as siblings
- Use `call()` from `@orpc/server` to test procedures with full middleware stack
- Test utilities in `packages/api/src/test-utils/`:
  - `fixtures.ts` - Shared mock data factories (`createMockUser`, `createMockSession`, `createMockSessionData`)
  - `helpers.ts` - Test helpers (`callAuthenticated`, `expectORPCError`, `MockAuth` type)
- Testing patterns:
  - **Authenticated procedures**: Use `callAuthenticated(procedure, input, mockAuth)` helper
  - **Error assertions**: Use `expectORPCError(() => call(...), 'errorCode', 'optional message')` helper
  - **Mock setup**: Global mocks in `src/test-setup.ts` (preloaded via `bunfig.toml`)
  - **Mock cleanup**: Always use `beforeEach()` to clear mocks between tests
  - **Test naming**: Use "should X when Y" pattern for clarity
  - **Coverage**: Test both success and error paths, including auth rejection
- Example test structure:

```typescript
import {
  callAuthenticated,
  expectORPCError,
  type MockAuth,
} from "../../../test-utils/helpers";
import { createMockUser } from "../../../test-utils/fixtures";

test("should update user successfully", async () => {
  const updatedUser = createMockUser({ name: "Updated" });
  mockDb.update().set().where().returning.mockResolvedValueOnce([updatedUser]);

  const result = await callAuthenticated(
    updateUser,
    { name: "Updated" },
    mockAuth
  );

  expect(result.name).toBe("Updated");
});
```

- Run tests: `bun test` (from project root or `packages/api`)
- Tests run automatically with `SKIP_ENV_VALIDATION=1` to bypass env validation

## Server Package (packages/server/)

**Purpose:** Server-only code including database, server constants, and environment variables

**Structure:**

- `drizzle.config.ts` - Drizzle Kit configuration (auto-detects PGlite vs Neon)
- `drizzle/` - Database migrations (committed to git for schema history)
- `src/consts.ts` - Server-only static constants (payment config, integrations, email settings)
- `src/env.ts` - Server-only env vars with Zod validation
- `src/db/` - Database schema and Drizzle client
  - `schema.ts` - Drizzle schema with Better Auth tables and performance indexes
  - `index.ts` - Database client (auto-switches between PGlite and Neon)
  - `CLAUDE.md` - Critical documentation about manual index management

**Database Driver Selection:**

- **No `DATABASE_URL`** → Uses PGlite with file persistence in `.pglite/`
- **`DATABASE_URL` set** → Uses Neon serverless driver
- `isPglite` export indicates which driver is active

**Exports:**

- `@workspace/server/consts` - Server-only static constants
- `@workspace/server/env` - Server-only env vars + `isLocalDev` flag
- `@workspace/server/db` - Database client + `isPglite` flag
- `@workspace/server/db/schema` - Database schema

## API Package (packages/api/)

**Purpose:** Backend logic package containing authentication and oRPC procedures

**Structure:**

- `src/auth.ts` - Better Auth configuration with Drizzle adapter
- `src/logger.ts` - Pino logger configuration
- `src/orpc/` - oRPC server implementation
  - `errors.ts` - Common error definitions shared across all procedures
  - `contract/index.ts` - Main contract that composes domain contracts
  - `procedures/` - Domain-organized procedures (contracts + handlers side-by-side)
  - `base.ts` - Base implementer with logger middleware
  - `router.ts` - Main router exported to API routes
  - `server-client.ts` - Direct server-side client (no HTTP overhead)
  - `middleware/auth.ts` - Better Auth session validation middleware

**Exports:**

- `@workspace/api/auth` - Better Auth instance
- `@workspace/api/logger` - Pino logger instance
- `@workspace/api/orpc/errors` - Common error definitions (UNAUTHORIZED, OPERATION_FAILED)
- `@workspace/api/orpc/contract` - Main oRPC contract definition (composed)
- `@workspace/api/orpc/procedures/{domain}/{domain}.contract` - Domain-specific contracts
- `@workspace/api/orpc/router` - Main oRPC router (type-only)
- `@workspace/api/orpc/server-client` - Server-side oRPC client

**Usage in apps/web:**

- API routes import from `@workspace/api` to access backend logic
- Client components import types only (e.g., `import type { auth } from "@workspace/api/auth"`)
- All server code stays in this package - apps/web has no server/ directory

**Contract Organization:**

- Each domain has its own directory with contract and handler side-by-side
- Pattern: `procedures/{domain}/{domain}.contract.ts` + `{domain}.handler.ts`
- Main contract composes domain contracts: `contract/index.ts` imports from procedure directories
- Frontend imports: Use `@workspace/api/orpc/contract` for composed contract, or `@workspace/api/orpc/procedures/{domain}/{domain}.contract` for domain-specific contracts

## Shared Package (packages/shared/)

**Purpose:** Client + server shared code including constants, env validation, and error handling utilities

**Configuration:**

- `src/consts.ts` - Static app constants (no env validation triggered on import)
- `src/env.ts` - Client-side env vars (`NEXT_PUBLIC_*`) with Zod validation
- Both use `@t3-oss/env-nextjs` for type-safe environment variable validation

**Error Handling:**

- `getErrorMessage(error, fallbackMessage?)` - Extracts user-friendly error messages from unknown errors
- Handles string errors and objects with message property (including Error objects)
- Simple and focused - no over-engineering

**Usage Pattern:**

```typescript
import { getErrorMessage } from "@workspace/shared/utils/error";

try {
  await someOperation();
} catch (error) {
  const message = getErrorMessage(error, "Operation failed");
  console.error(message);
  toast({ title: message, variant: "destructive" });
}
```

**Best Practices:**

- Always use `getErrorMessage()` when catching errors to avoid `any` types
- Prefer `catch (error)` over `catch (error: any)` - let the utility handle type narrowing
- Provide contextual fallback messages for better user experience

**Exports:**

- `@workspace/shared/consts` - Static app constants
- `@workspace/shared/env` - Client-side env vars
- `@workspace/shared/utils/error` - Error handling utilities

## UI Package (packages/ui/)

**Component Library:** Based on shadcn/ui with Radix UI primitives

**Radix UI Migration:** This project uses the `@radix-ui/*` monorepo packages (migrated via `npx shadcn@latest migrate radix`). All Radix components are installed as individual packages rather than the legacy `@radix-ui/react-*` format.

**Key Components:** Alert, Button, Checkbox, Field, Input, InputGroup, Label, Popover, RadioGroup, ScrollArea, Select, Separator, Skeleton, Sonner (toasts), Spinner, Switch, Textarea, Tooltip, AlertDialog, Header, Footer, MobileNav, Container, Section

**Layout Components:**

- `Header` - Site header with logo, nav links, theme toggle, mobile menu
- `Footer` - Site footer with logo, nav columns, social links, copyright
- `MobileNav` - Hamburger menu with slide-out drawer (Radix Dialog)
- `Container` - Max-width wrapper with consistent padding
- `Section` - Landing page section with consistent vertical spacing

**UI Requirements (MUST follow):**

- **MUST be mobile-friendly**: Every web page MUST be fully responsive and work perfectly on mobile devices. This is non-negotiable.
- **Responsive-first**: All components MUST work on mobile (375px+), tablet (768px+), and desktop (1280px+)
- **Theme-friendly**: All components MUST support light and dark themes via CSS variables
- **Accessibility**: Use semantic HTML, proper ARIA attributes, keyboard navigation

**Styling:**

- Tailwind CSS 4.1 with `@tailwindcss/postcss`
- `tw-animate-css` for animations
- Utility function `cn()` in `lib/utils.ts` for class merging (clsx + tailwind-merge)

**Exports:**

- Components: `@workspace/ui/components/*`
- Hooks: `@workspace/ui/hooks/*`
- Utils: `@workspace/ui/lib/*`
- Styles: `@workspace/ui/globals.css`
- PostCSS config: `@workspace/ui/postcss.config`

**Logo Components:**

- `Logo.tsx` - Full logo with text
- `LogoIcon.tsx` - Icon-only version

**Adding New Components:**

Use shadcn CLI to add components: `npx shadcn@latest add <component-name>`

## Build Tools & Configuration

### Linting & Code Quality

- **Biome** - Code formatting and linting (TypeScript, React, accessibility)
  - Comprehensive rules for correctness, complexity, and suspicious patterns
  - React-specific rules: hooks at top level, exhaustive dependencies
  - Accessibility (a11y) rules enabled
  - All unsafe fixes require explicit `--unsafe` flag

### TypeScript Configuration

- Shared configs in `packages/typescript-config/` with strict mode
- Uses `"moduleResolution": "bundler"` - Optimized for Next.js and Bun (no `.js` extensions needed in imports)
- Module format: `"module": "ESNext"` for modern JavaScript features
- Incremental compilation enabled for faster builds

### Turborepo Configuration

- All environment variables must be declared in `turbo.json` under `globalEnv`
- Tasks configured in `turbo.json` with dependency chains for build, lint, and type checking

---

# 6. Configuration

## Environment Variables

**Zero-Config Local Development:**

Most environment variables are optional for local development. The system auto-configures:

| Variable                  | Local Dev (no DATABASE_URL)              | Production |
| ------------------------- | ---------------------------------------- | ---------- |
| `DATABASE_URL`            | Optional (uses PGlite)                   | Required   |
| `BETTER_AUTH_SECRET`      | Optional (uses dev secret with warning)  | Required   |
| `GOOGLE_CLIENT_ID/SECRET` | Optional (disables Google OAuth)         | Optional   |
| `RESEND_API_KEY`          | Optional (magic links logged to console) | Optional   |

**Auth Behavior Based on Credentials:**

| Credentials Set | Google OAuth | Magic Link   | Email/Password |
| --------------- | ------------ | ------------ | -------------- |
| None            | ❌           | ✅ (console) | ✅ (fallback)  |
| Google only     | ✅           | ✅ (console) | ❌             |
| Resend only     | ❌           | ✅ (email)   | ✅ (fallback)  |
| Google + Resend | ✅           | ✅ (email)   | ❌             |

**Configuration Files:**

- `packages/shared/src/consts.ts` - Client-side static constants
- `packages/shared/src/env.ts` - Client-side env vars (`NEXT_PUBLIC_*`)
- `packages/server/src/consts.ts` - Server-side static constants
- `packages/server/src/env.ts` - Server-side env vars (flexible based on `DATABASE_URL` presence)

**Additional Notes:**

- All env vars must be declared in `turbo.json` under `globalEnv`
- Skip validation with `SKIP_ENV_VALIDATION=1` - **ONLY** use for runtime commands in environments without env vars (CI pipelines)
- **NEVER use `SKIP_ENV_VALIDATION=1` with type checking or linting** - these commands don't execute code and don't need env vars
