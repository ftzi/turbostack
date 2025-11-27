# Project Context

## Purpose

Turbostack is a monorepo template/starter based on shadcn and NextStack templates. It provides a production-ready foundation for building modern web applications with type-safe APIs, authentication, and a shared UI component library.

## Tech Stack

### Core

- **Runtime:** Bun 1.3.1 (package manager and test runner)
- **Build Orchestration:** Turborepo
- **Language:** TypeScript 5.9.3 (strict mode, bundler resolution)

### Frontend

- **Framework:** Next.js 16 with App Router and React Server Components
- **React:** 19.2.0 with React Compiler enabled
- **Styling:** Tailwind CSS 4.1 with `@tailwindcss/postcss`
- **UI Components:** shadcn/ui with Radix UI primitives
- **Data Fetching:** TanStack Query with oRPC integration

### Backend

- **API Layer:** oRPC (contract-first, type-safe RPC)
- **Authentication:** Better Auth with Drizzle adapter
- **Database:** PostgreSQL via Neon serverless with Drizzle ORM
- **Logging:** Pino with structured logging

### Tooling

- **Linting/Formatting:** Biome (no ESLint/Prettier)
- **Environment Variables:** `@t3-oss/env-nextjs` with Zod validation
- **Email:** Resend with react-email templates

## Project Conventions

### Code Style

- **NEVER use `any` type** - Use `unknown` if truly unknown, prefer specific types
- **NEVER use `interface`** - Always use `type`
- **NEVER use barrel files** - Import directly from source files
- **Object parameters over multiple args** - `function foo({ name, age }: Props)` not `function foo(name, age)`
- **Optional chaining for callbacks** - `onComplete?.(data)` not `if (onComplete) onComplete(data)`
- **No manual memoization** - React Compiler handles `useMemo`/`useCallback` automatically
- **Reference links in code** - Add `// Reference: <url>` when implementing from docs

### Architecture Patterns

- **Monorepo Structure:**
  - `apps/web/` - Next.js frontend (pages, components, UI)
  - `packages/api/` - Backend logic (auth, database, oRPC, procedures)
  - `packages/ui/` - Shared shadcn-based component library
  - `packages/shared/` - Generic utilities and app configuration
  - `packages/email/` - Email templates

- **oRPC Contract-First Pattern:**
  - Contracts collocated with handlers: `procedures/{domain}/{domain}.contract.ts` + `{domain}.handler.ts`
  - Main contract composes domain contracts in `contract/index.ts`
  - Common errors defined in `errors.ts` and shared across procedures
  - Use `.router()` at root level to enforce contract at runtime

- **Environment Variables:**
  - Client vars in `packages/shared/src/consts.ts` (`NEXT_PUBLIC_*`)
  - Server vars in `packages/shared/src/serverConsts.ts`
  - Feature flags control conditional Zod schemas

### Testing Strategy

- **Framework:** Bun's built-in test runner
- **Location:** Test files colocated with handlers as `{handler-name}.test.ts`
- **Pattern:** Use `call()` from `@orpc/server` to test with full middleware stack
- **Utilities:** Shared fixtures and helpers in `packages/api/src/test-utils/`
- **Coverage:** Test both success and error paths, including auth rejection
- **Naming:** Use "should X when Y" pattern

### Git Workflow

- All changes require `bun ok` to pass (type checking + linting)
- Never commit without explicit user request
- Never use `git stash` without explicit instruction
- Never run destructive git commands without explicit confirmation

## Domain Context

This is a starter template, not a domain-specific application. The patterns established here are meant to be extended for specific use cases. Key extension points:

- Add new oRPC procedures in `packages/api/src/orpc/procedures/{domain}/`
- Add new UI components via `npx shadcn@latest add <component>`
- Add new pages in `apps/web/app/`

## Important Constraints

- **Node.js >= 20 required**
- **Bun must be used** - Never npm/yarn/pnpm
- **React 19.2+ features available** - `<Activity>`, `useEffectEvent()`
- **Server Components by default** - Use `"use client"` only when needed
- **No documentation files** - Never create `.md` files unless explicitly requested
- **No placeholder code** - Implement fully or explain why not possible
- **Always run `bun ok` from project root** - Never from subdirectories

## External Dependencies

- **Neon** - Serverless PostgreSQL database
- **Resend** - Email delivery service
- **Google OAuth** - Authentication provider (configured in Better Auth)
- **Vercel** - Deployment platform (env vars via `bun env`)
