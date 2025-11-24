# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Important:** If you discover any information in this file that is no longer accurate or has become outdated, please update it immediately to reflect the current state of the codebase.

**Workflow Rule:** Always run `bun ok` after finishing a task or when facing issues. This command runs type checking and linting across the entire codebase and must fully pass before considering a task complete.

**Context7 Integration:** Always use context7 when I need code generation, setup or configuration steps, or library/API documentation. This means you should automatically use the Context7 MCP tools to resolve library id and get library docs without me having to explicitly ask.

**MCP Servers:** This repository uses `.mcp.json` for team-wide MCP server configuration:
- **better-auth** - Better Auth documentation and assistance
- **next-devtools** - Next.js 16 debugging and diagnostics
- **context7** - Library documentation and code generation
- Team members will be prompted to trust these servers on first use

## AI Assistant Workflow

**Sub-Agent Usage (Proactive):**
Use specialized sub-agents automatically for these scenarios - do NOT run direct searches:

- **Explore Agent** - For codebase exploration and understanding:
  - "Where is X handled?" / "How does Y work?" / "What's the structure of Z?"
  - "Show me the authentication flow" / "Explain the API architecture"
  - Questions about multiple files or complex patterns
  - Use `thoroughness: "medium"` by default, `"very thorough"` for complex investigations

- **Plan Agent** - Before implementing multi-step changes:
  - Adding new features that touch multiple files
  - Refactoring that affects multiple domains
  - Complex migrations or architectural changes
  - Use this BEFORE starting implementation to break down work

- **General-Purpose Agent** - For complex searches requiring iteration:
  - Finding patterns across the codebase that may require multiple search attempts
  - When the first search attempt doesn't yield clear results
  - Open-ended investigations that need refinement

**Implementation Pattern:**
1. For exploratory questions → Spawn Explore agent first
2. For complex implementations → Use Plan agent to break down work
3. Track all work with TodoWrite tool
4. Implement step-by-step
5. ALWAYS run `bun ok` after completion

**Task Tracking:**
- Use TodoWrite for all multi-step tasks (3+ steps)
- Mark tasks `in_progress` before starting work
- Mark `completed` immediately after finishing each task
- Keep descriptions clear and actionable

## Maintaining This File

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

## Project Overview

Turbostack is a monorepo based on shadcn and NextStack templates. It uses Turborepo for build orchestration, Bun as the package manager, Next.js for the web app, and includes a shared UI component library.

## Common Commands

### Development
- `bun dev` - Install dependencies and start dev server with TypeScript watch mode
- `bun dev` - Start all apps in development mode (runs `turbo dev tsw`)
- `bun tsw` - Run TypeScript in watch mode across all workspaces

### Type Checking & Linting
- `bun ts` - Type check all workspaces with TypeScript
- `bun lint` - Format and lint with Biome across all workspaces
- `bun ok` - Run both ts and lint (quick verification)
- `bun knip` - Find unused files, dependencies, and exports (Reference: https://knip.dev)
  - Note: Knip may report infrastructure files (auth-client.ts, orpc/client.ts, etc.) as unused until features are built
  - Review Knip output carefully - not all reports are actionable

### Building
- `bun build` - Build all apps and packages

### Database (Drizzle ORM)
- `bun db:studio` - Open Drizzle Studio (delegates to packages/api)
- `bun db:generate` - Generate database migrations (delegates to packages/api)
- `bun db:migrate` - Run database migrations (delegates to packages/api)
- Configuration and migrations now live in `packages/api/` where the database code is
- Can also run directly from api package: `bun run --cwd packages/api db:studio`

### Environment Variables
- `bun env` - Pull environment variables from Vercel

### Web App Specific (in apps/web/)
- `bun dev` - Start Next.js dev server with Turbopack
- `bun build` - Build the Next.js app
- `bun ts` - Type check web app
- `bun tsw` - TypeScript watch mode for web app
- `bun lint` - Format and lint with Biome (auto-fix enabled)
- `bun lint:dry` - Check formatting and linting without auto-fix

## Architecture

### Monorepo Structure

This is a Turborepo monorepo with two main workspace types:

- **apps/** - Application projects
  - **web/** - Next.js 16 app (frontend: pages, components, UI)

- **packages/** - Shared packages
  - **api/** - Backend logic (Better Auth, oRPC, database, server config, contracts)
  - **email/** - Email templates using react-email
  - **shared/** - Generic utilities and helpers (error handling, etc.)
  - **ui/** - Shared UI component library (shadcn-based)
  - **typescript-config/** - Shared TypeScript configurations

### Package Management

- Uses **Bun 1.3.1** as package manager (defined in package.json)
- Workspace catalog manages shared dependencies (React 19.2.0, TypeScript 5.9.3, Zod 4.1.12, etc.)
- All internal packages use `workspace:*` protocol for dependencies

### Web App (apps/web/)

**Framework:** Next.js 16 with App Router and React Server Components

**Versions & Features:**
- React 19.2.0 with `<Activity>` component, `useEffectEvent()` hook, and View Transitions
- Next.js 16 with DevTools MCP integration for AI-assisted debugging
- React Compiler enabled (`reactCompiler: true`) for automatic component memoization

**Key Patterns:**
- Uses App Router with route groups: `app/(home)/` for public pages
- Client/server separation enforced via `"server-only"` imports
- Environment variables validated with `@t3-oss/env-nextjs` and Zod
- Two env files: `lib/consts.ts` (client + server) and `server/serverConsts.ts` (server-only)

**Configuration:**
- `packages/shared/src/consts.ts` - App constants and client-side env vars (`NEXT_PUBLIC_*`)
- `packages/shared/src/serverConsts.ts` - Server-only constants and env vars (database, API keys, payment processor config)
- Both use `createEnv()` from `@t3-oss/env-nextjs` for type-safe env validation
- Pattern: Feature flags (e.g., `emailEnabled`) control which env vars are required via conditional Zod schemas

**Email Integration:**
- Email sending via Resend (configured in `packages/shared/src/serverConsts.ts`)
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
- Procedures access contract paths: `os.ping.handler()` or `authorized.auth.ping.handler()`
- Router uses `.router()` method to enforce contract at runtime in `packages/api/src/orpc/router.ts`
- API route handler: `apps/web/app/api/rpc/[[...rest]]/route.ts` with compression and logging plugins
- Client setup: `apps/web/lib/query.ts` exports `client` (HTTP client) and `orpc` (TanStack Query utils)
- Server-optimized client: `packages/api/src/orpc/server-client.ts` exports `createServerClient()` function
- Better Auth integration via middleware in `packages/api/src/orpc/middleware/auth.ts`
- Pattern: Use `os` for public procedures, `authorized` for authenticated procedures
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

### API Package (packages/api/)

**Purpose:** Backend logic package containing all server-side code

**Structure:**
- `drizzle.config.ts` - Drizzle Kit configuration
- `drizzle/` - Database migrations (committed to git for schema history)
- `src/auth.ts` - Better Auth configuration with Drizzle adapter
- `src/logger.ts` - Pino logger configuration
- `src/db/` - Database schema and Drizzle client
  - `schema.ts` - Drizzle schema with Better Auth tables and performance indexes
  - `index.ts` - Database client using Neon serverless
  - `CLAUDE.md` - Critical documentation about manual index management
- `src/orpc/` - oRPC server implementation
  - `errors.ts` - Common error definitions (UNAUTHORIZED, OPERATION_FAILED) shared across all procedures
  - `contract/index.ts` - Main contract that composes domain contracts
  - `procedures/` - Domain-organized procedures (contracts + handlers side-by-side)
    - `ping/` - Public ping endpoint
      - `ping.contract.ts` - Ping contract definition
      - `ping.handler.ts` - Ping handler implementation
    - `auth/` - Authentication endpoints
      - `auth.contract.ts` - Auth contract definition
      - `auth.handler.ts` - Auth handler implementations
    - `user/` - User management endpoints
      - `user.contract.ts` - User contract definition
      - `user.handler.ts` - User handler implementations
  - `base.ts` - Base implementer with logger middleware
  - `router.ts` - Main router exported to API routes
  - `server-client.ts` - Direct server-side client (no HTTP overhead)
  - `middleware/auth.ts` - Better Auth session validation middleware (throws UNAUTHORIZED error)

**Exports:**
- `@workspace/api/auth` - Better Auth instance
- `@workspace/api/logger` - Pino logger instance
- `@workspace/api/db` - Database client
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

### Shared Package (packages/shared/)

**Purpose:** Shared code that can be reused across the entire workspace, including generic utilities and application configuration

**Configuration:**
- `src/consts.ts` - App constants and client-side env vars (`NEXT_PUBLIC_*`)
- `src/serverConsts.ts` - Server-only constants and env vars (database, API keys, etc.)
- Both use `@t3-oss/env-nextjs` for type-safe environment variable validation
- Located here so both `api` and `email` packages can access them without circular dependencies

**Error Handling:**
- `getErrorMessage(error, fallbackMessage?)` - Extracts user-friendly error messages from unknown errors
- Handles string errors and objects with message property (including Error objects)
- Simple and focused - no over-engineering

**Usage Pattern:**
```typescript
import { getErrorMessage } from "@workspace/shared/utils/error"

try {
  await someOperation()
} catch (error) {
  const message = getErrorMessage(error, "Operation failed")
  console.error(message)
  toast({ title: message, variant: "destructive" })
}
```

**Best Practices:**
- Always use `getErrorMessage()` when catching errors to avoid `any` types
- Prefer `catch (error)` over `catch (error: any)` - let the utility handle type narrowing
- Provide contextual fallback messages for better user experience

**Exports:**
- `@workspace/shared/consts` - App constants and client-side env vars
- `@workspace/shared/server-consts` - Server-only constants and env vars
- `@workspace/shared/utils/error` - Error handling utilities

### UI Package (packages/ui/)

**Component Library:** Based on shadcn/ui with Radix UI primitives

**Radix UI Migration:** This project uses the `@radix-ui/*` monorepo packages (migrated via `npx shadcn@latest migrate radix`). All Radix components are installed as individual packages rather than the legacy `@radix-ui/react-*` format.

**Key Components:** Alert, Button, Checkbox, Field, Input, InputGroup, Label, Popover, RadioGroup, ScrollArea, Select, Separator, Skeleton, Sonner (toasts), Spinner, Switch, Textarea, Tooltip, AlertDialog

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

## Adding New UI Components

Use shadcn CLI to add components: `npx shadcn@latest add <component-name>`

## Environment Variables

- Configured in `lib/consts.ts` (client) and `server/serverConsts.ts` (server)
- Feature flags control which env vars are required (e.g., `emailEnabled` in `lib/consts.ts`)
- All env vars must be declared in `turbo.json` under `globalEnv`
- Skip validation with `SKIP_ENV_VALIDATION=1` - **ONLY** use for runtime commands in environments without env vars (Docker builds, CI pipelines)
- **NEVER use `SKIP_ENV_VALIDATION=1` with type checking or linting** - these commands don't execute code and don't need env vars

## Code Quality Standards

**Development Workflow:**
- Do NOT attempt to run development servers - they're already running and not accessible to Claude Code
- Do NOT try to call API endpoints - you don't have authentication access
- NEVER use `sleep` commands - they are unnecessary and wasteful
- **ALWAYS use `bun ok`** for type checking and linting - never use `bun ts`, `bun lint`, or `tsc` directly
- **NEVER run `tsc` directly** - not even for single files - always use `bun ok`
- **CRITICAL: `bun ok` MUST ALWAYS be run from the project root directory**
  - NEVER run it from subdirectories like `apps/web` or `packages/*`
  - Always navigate to the root first: `cd <project-root> && bun ok`
  - This is a Turborepo monorepo - the command must run from root to check all packages
- `bun ok` runs both type checking and linting, leverages Turbo cache, and is always preferred
- **NEVER run Drizzle Kit commands directly** - `bun db:generate`, `drizzle-kit generate`, `drizzle-kit migrate`, etc. require interactive input
  - After making schema changes, ALWAYS prompt the user to run `bun db:generate` manually
  - Format: "Schema changes complete. Please run: `bun db:generate`"
  - Never attempt to run these commands - they need user interaction for table renames/drops
- NEVER commit or push code - all git operations must be explicitly requested by the user
- NEVER run `git stash` or `git stash pop` - do not hide or restore changes without explicit instruction
- **Use sub-agents proactively** - Spawn Explore agents for codebase questions, Plan agents for complex implementations (see AI Assistant Workflow section)

**Code Principles:** Follow Clean Code + SOLID + KISS + YAGNI
- **Clean Code**: Self-documenting, readable code with meaningful names and single responsibility
- **SOLID**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **KISS**: Simplest solution that solves the problem, avoid over-engineering
- **YAGNI**: Don't add functionality until actually needed

**TypeScript Conventions:**
- **NEVER use `any` type** - Use `unknown` if type is truly unknown, but even that should be avoided
- **NEVER use `as any` assertions** - Find the proper type or use specific type assertions
- **NEVER use `interface`** - Always use `type` instead
- Reuse existing types - don't create duplicate types
- Use Zod schemas for runtime validation when appropriate
- Add comments to object type properties only when not self-explanatory (skip obvious ones like `className`)
- Prefer optional chaining for callbacks: `onComplete?.(data)` instead of `if (onComplete) onComplete(data)`

**Import Conventions:**
- **NEVER use barrel files** - Barrel files (index.ts files that re-export everything) are forbidden
- **NEVER re-export from external libraries** - Always import directly from the library where it's needed
  - Example: Import `getLogger` from `@orpc/experimental-pino` directly in the file that uses it
  - Do NOT create wrapper functions that just re-export library functions - this adds unnecessary indirection
  - Re-exporting makes it unclear where the actual implementation lives and breaks IDE navigation
- **Always import directly from source files** - Import from the actual file where the code is defined
- Example: Use `import { getErrorMessage } from "@workspace/shared/utils/error"` instead of `import { getErrorMessage } from "@workspace/shared"`
- Package exports should point directly to source files, not to barrel files
- This improves tree-shaking, makes dependencies explicit, and reduces circular dependency issues

**Function Parameters:**
- Prefer object parameters over multiple direct parameters
- Example: `function foo({ name, age }: { name: string; age: number })` instead of `function foo(name: string, age: number)`

**Error Handling:**
- Always use `getErrorMessage()` from `@workspace/shared/utils/error` for error handling
- NEVER use `catch (error: any)` - use `catch (error)` and let the utility handle type narrowing
- Provide contextual fallback messages: `getErrorMessage(error, "Failed to update user")`
- Example:
```typescript
import { getErrorMessage } from "@workspace/shared/utils/error"

try {
  await someOperation()
} catch (error) {
  const message = getErrorMessage(error, "Operation failed")
  console.error(message)
  toast({ title: message, variant: "destructive" })
}
```

**Comments:**
- Do NOT add comments explaining what changes you just made
- Only add comments for complex logic that isn't self-evident
- Use JSDoc-style comments for public APIs
- **Always add reference links** when implementing code from documentation or external sources (unless it's common/trivial code)
  - Format: `// Reference: https://example.com/docs/feature`
  - Helps understand implementation decisions and find updated documentation later
  - Example: `// Reference: https://www.better-auth.com/docs/concepts/typescript#inferring-additional-fields`

**Console Logging:**
- Always stringify objects: `console.log('DEBUG:', JSON.stringify(data, null, 2))`
- Use a common keyword prefix (e.g., `DEBUG:`, `LOG:`) for easy filtering and bulk copying
- **Always clean up debug code** - Remove all console logs and debugging code once the root cause is found

**React Conventions:**
- **ALWAYS follow the Rules of Hooks**:
  - Only call hooks at the top level - never inside loops, conditions, or nested functions
  - Do not return early if there's a hook later in the component
  - Hooks must be called in the same order every render
- **React 19.2 Usage**:
  - `<Activity mode="hidden">` - Keeps UI mounted but hidden while preserving state (useful for pre-rendering tabs, loading background data)
  - `useEffectEvent()` - Separates event-like logic from reactive Effects when you need fresh props/state without re-triggering the effect (solves stale closure problems)
  - Avoid manual `useMemo`/`useCallback` - React Compiler handles memoization automatically unless profiling shows specific need

**Testing:**
- NEVER use `timeout` parameters when running tests - run tests normally without artificial timeouts
- Trust the test framework's default timeout behavior

**Implementation Standards:**
- When asked to implement something, implement it FULLY and completely
- NEVER add placeholder comments like "to be implemented later" or "this will be done when API supports it"
- If something cannot be completed, explain why explicitly rather than leaving incomplete code
- **NEVER create documentation files** - No `.md` files, no READMEs, no CHANGELOG files, no migration guides, NOTHING unless explicitly requested
  - This includes: CHANGELOG.md, MIGRATION.md, NOTES.md, GUIDE.md, or any other documentation
  - The only exception: updating existing CLAUDE.md when architecture changes
  - If you want to communicate what changed, tell the user directly - don't create files

## Important Notes

- **Package Manager:** Always use `bun` instead of npm/yarn/pnpm
- **Node Version:** Requires Node.js >= 20
- **React Version:** Uses React 19.2.0 (latest)
- **Route Groups:** Next.js routes use parentheses for grouping (e.g., `(home)/page.tsx`)
- **Server Components:** Default to Server Components; use `"use client"` directive only when needed
- **Import Paths:** Use workspace aliases (`@workspace/ui`, `@workspace/typescript-config`, etc.)
- **Authentication:** Configured for Google OAuth (client ID and secret in server env)
- **API Routes with JSX:** Use `.tsx` extension for API routes that contain JSX (required for Biome formatting)
