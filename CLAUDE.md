# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Important:** If you discover any information in this file that is no longer accurate or has become outdated, please update it immediately to reflect the current state of the codebase.

**Workflow Rule:** Always run `bun run ok` after finishing a task or when facing issues. This command runs type checking and linting across the entire codebase and must fully pass before considering a task complete.

## Maintaining This File

Update CLAUDE.md when you make changes that affect:
- **Architecture & Structure**: Monorepo organization, new workspaces, routing patterns, data flow
- **Development Workflow**: New commands, build process changes, testing setup
- **Key Patterns & Conventions**: Environment variables, authentication, API patterns, file organization
- **Tool & Library Migrations**: Package manager changes, major dependency updates, framework migrations
- **Configuration Changes**: TypeScript, ESLint, or build tool configurations that affect how developers work

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
- `bun run dev` - Start all apps in development mode (runs `turbo dev tsw`)
- `bun run tsw` - Run TypeScript in watch mode across all workspaces

### Type Checking & Linting
- `bun ts` - Type check all workspaces with TypeScript
- `bun run lint` - Format with Biome + lint with ESLint across all workspaces
- `bun run ok` - Run both ts and lint (quick verification)

### Building
- `bun run build` - Build all apps and packages

### Database (Drizzle ORM)
- `bun run db:studio` - Open Drizzle Studio
- `bun run db:generate` - Generate database migrations
- `bun run db:migrate` - Run database migrations

### Environment Variables
- `bun run env` - Pull environment variables from Vercel

### Web App Specific (in apps/web/)
- `bun dev` - Start Next.js dev server with Turbopack
- `bun run build` - Build the Next.js app
- `bun ts` - Type check web app
- `bun run tsw` - TypeScript watch mode for web app
- `bun lint` - Format with Biome + lint with ESLint (auto-fix enabled)
- `bun run lint:dry` - Check formatting and linting without auto-fix

## Architecture

### Monorepo Structure

This is a Turborepo monorepo with two main workspace types:

- **apps/** - Application projects
  - **web/** - Next.js 16 app (main web application)
  - **email/** - Email templates using react-email

- **packages/** - Shared packages
  - **api-contract/** - oRPC contract definitions and Zod schemas
  - **ui/** - Shared UI component library (shadcn-based)
  - **eslint-config/** - Shared ESLint configurations
  - **typescript-config/** - Shared TypeScript configurations

### Package Management

- Uses **Bun 1.3.1** as package manager (defined in package.json)
- Workspace catalog manages shared dependencies (React 19.2.0, TypeScript 5.9.3, Zod 4.1.12, etc.)
- All internal packages use `workspace:*` protocol for dependencies

### Web App (apps/web/)

**Framework:** Next.js 16 with App Router and React Server Components

**Key Patterns:**
- Uses App Router with route groups: `app/(home)/` for public pages
- Client/server separation enforced via `"server-only"` imports
- Environment variables validated with `@t3-oss/env-nextjs` and Zod
- Two env files: `lib/consts.ts` (client + server) and `server/serverConsts.ts` (server-only)

**Configuration:**
- `lib/consts.ts` - App constants and client-side env vars (`NEXT_PUBLIC_*`)
- `server/serverConsts.ts` - Server-only constants and env vars (database, API keys, payment processor config)
- Both use `createEnv()` from `@t3-oss/env-nextjs` for type-safe env validation
- Pattern: Feature flags (e.g., `emailEnabled`) control which env vars are required via conditional Zod schemas

**Email Integration:**
- Email sending via Resend (configured in `server/serverConsts.ts`)
- Email templates in `apps/email/templates/`
- Main email logic in `apps/email/email.tsx`

**Metadata & OpenGraph:**
- OpenGraph utilities in `apps/web/lib/opengraph/` with Zod schema validation
- API route: `app/api/og/route.tsx` - Generates dynamic OG images with 1-hour cache
- API route: `app/api/icon/route.tsx` - Generates dynamic favicons based on theme (`?theme=light|dark`)
- Layout pattern: Import DEFAULT_OPENGRAPH from `@/lib/opengraph/defaults`, spread and override as needed
- Note: Use `.tsx` extension for API routes containing JSX (required for Biome formatting)

**oRPC API (Type-Safe RPC):**
- Uses contract-first pattern with shared Zod schemas in `packages/api-contract`
- Contract definitions in `packages/api-contract/src/contract.ts` using `oc` from `@orpc/contract`
- Schemas organized in `packages/api-contract/src/schemas/` (auth.ts, user.ts)
- Server procedures in `apps/web/server/orpc/procedures/`
- Main router in `apps/web/server/orpc/router.ts`
- API route handler: `app/api/rpc/[[...rest]]/route.ts` with compression plugin
- Client setup: `lib/orpc/client.ts` (works in both client and server components)
- Server-optimized client: `lib/orpc/server.ts` (direct calls without HTTP overhead, server-only)
- Better Auth integration via middleware in `server/orpc/middleware/auth.ts`
- Pattern: Use `base` for public procedures, `authorized` for authenticated procedures
- All procedures automatically type-safe based on contract definitions

### API Contract Package (packages/api-contract/)

**Structure:** Contract-first oRPC setup with TypeScript Project References
- `src/contract.ts` - Main contract definition using `@orpc/contract`
- `src/schemas/` - Zod input/output schemas for all procedures
- Uses `composite: true` in tsconfig.json for proper monorepo type references
- All relative imports must use `.js` extensions (required by NodeNext module resolution)

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

- **Biome** - Code formatting only (linting disabled)
- **ESLint** - TypeScript and React linting, all errors converted to warnings via `eslint-plugin-only-warn`
- Shared ESLint configs in `packages/eslint-config/` (base, Next.js, React)

### TypeScript Configuration

- Shared configs in `packages/typescript-config/` with strict mode
- Incremental compilation enabled for faster builds

### Turborepo Configuration

- All environment variables must be declared in `turbo.json` under `globalEnv` (enforced by ESLint)
- Tasks configured in `turbo.json` with dependency chains for build, lint, and type checking

## Adding New UI Components

Use shadcn CLI to add components: `npx shadcn@latest add <component-name>`

## Environment Variables

- Configured in `lib/consts.ts` (client) and `server/serverConsts.ts` (server)
- Feature flags control which env vars are required (e.g., `emailEnabled` in `lib/consts.ts`)
- All env vars must be declared in `turbo.json` under `globalEnv`
- Skip validation with `SKIP_ENV_VALIDATION=1` (useful for Docker builds)

## Code Quality Standards

**Development Workflow:**
- Do NOT attempt to run development servers - they're already running and not accessible to Claude Code
- Do NOT try to call API endpoints - you don't have authentication access
- NEVER use `sleep` commands - they are unnecessary and wasteful
- Use `bun ts` for type checking, not `bun build` (unless you specifically need to build)
- Use `bun ok` instead of direct `tsc` commands - it leverages Turbo cache and is much faster
- NEVER commit or push code - all git operations must be explicitly requested by the user
- NEVER run `git stash` or `git stash pop` - do not hide or restore changes without explicit instruction

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

**Function Parameters:**
- Prefer object parameters over multiple direct parameters
- Example: `function foo({ name, age }: { name: string; age: number })` instead of `function foo(name: string, age: number)`

**Comments:**
- Do NOT add comments explaining what changes you just made
- Only add comments for complex logic that isn't self-evident
- Use JSDoc-style comments for public APIs

**Console Logging:**
- Always stringify objects: `console.log('DEBUG:', JSON.stringify(data, null, 2))`
- Use a common keyword prefix (e.g., `DEBUG:`, `LOG:`) for easy filtering and bulk copying
- **Always clean up debug code** - Remove all console logs and debugging code once the root cause is found

**React Conventions:**
- **ALWAYS follow the Rules of Hooks**:
  - Only call hooks at the top level - never inside loops, conditions, or nested functions
  - Do not return early if there's a hook later in the component
  - Hooks must be called in the same order every render

**Testing:**
- NEVER use `timeout` parameters when running tests - run tests normally without artificial timeouts
- Trust the test framework's default timeout behavior

**Implementation Standards:**
- When asked to implement something, implement it FULLY and completely
- NEVER add placeholder comments like "to be implemented later" or "this will be done when API supports it"
- If something cannot be completed, explain why explicitly rather than leaving incomplete code

## Important Notes

- **Package Manager:** Always use `bun` instead of npm/yarn/pnpm
- **Node Version:** Requires Node.js >= 20
- **React Version:** Uses React 19.2.0 (latest)
- **Route Groups:** Next.js routes use parentheses for grouping (e.g., `(home)/page.tsx`)
- **Server Components:** Default to Server Components; use `"use client"` directive only when needed
- **Import Paths:** Use workspace aliases (`@workspace/ui`, `@workspace/eslint-config`, etc.)
- **Authentication:** Configured for Google OAuth (client ID and secret in server env)
- **API Routes with JSX:** Use `.tsx` extension for API routes that contain JSX (required for Biome formatting)



