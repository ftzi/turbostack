# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Turbostack is a monorepo based on shadcn and NextStack templates. It uses Turborepo for build orchestration, Bun as the package manager, Next.js for the web app, and includes a shared UI component library.

## Common Commands

### Development
- `bun dev` - Install dependencies and start dev server with TypeScript watch mode
- `bun run dev` - Start all apps in development mode (runs `turbo dev tsw`)
- `bun run tsw` - Run TypeScript in watch mode across all workspaces

### Type Checking & Linting
- `bun run typecheck` - Type check all workspaces with TypeScript
- `bun run lint` - Lint all workspaces (uses Biome + ESLint)
- `bun run ok` - Run both typecheck and lint (quick verification)

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
- `bun run typecheck` - Type check web app
- `bun run tsw` - TypeScript watch mode for web app
- `bun lint` - Lint with Biome + ESLint (auto-fix enabled)

## Architecture

### Monorepo Structure

This is a Turborepo monorepo with two main workspace types:

- **apps/** - Application projects
  - **web/** - Next.js 16 app (main web application)
  - **email/** - Email templates using react-email

- **packages/** - Shared packages
  - **ui/** - Shared UI component library (shadcn-based)
  - **eslint-config/** - Shared ESLint configurations
  - **typescript-config/** - Shared TypeScript configurations

### Package Management

- Uses **Bun 1.3.1** as package manager (defined in package.json)
- Workspace catalog manages shared dependencies (React 19.2.0, TypeScript 5.9.3, etc.)
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

**Email Integration:**
- Email sending via Resend (configured in `server/serverConsts.ts`)
- Email templates in `apps/email/templates/`
- Main email logic in `apps/email/email.tsx`

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

**Dual Linting System:**
- **Biome** - Fast formatter and linter (runs first with `--unsafe --fix`)
- **ESLint** - Additional checks with TypeScript and React plugins

**ESLint Configuration:**
- Base config: `packages/eslint-config/base.js` (TypeScript, Prettier compat, Turbo plugin)
- Next.js config: `packages/eslint-config/next.js`
- React internal config: `packages/eslint-config/react-internal.js`
- All ESLint errors converted to warnings via `eslint-plugin-only-warn`

### TypeScript Configuration

Shared TypeScript configs in `packages/typescript-config/`:
- Strict mode enabled across all packages
- Next.js-specific config for web app
- React 19 with new JSX transform

### Turborepo Tasks

Defined in `turbo.json`:
- **build** - Depends on upstream builds, outputs to `.next/`, includes `.env*` in inputs
- **dev** - Persistent task, no caching
- **lint** - Depends on upstream lint tasks
- **typecheck** - Depends on upstream typecheck tasks
- **tsw** - TypeScript watch mode (no dependencies)

## Adding New UI Components

Use shadcn CLI to add components to the UI package:
```bash
npx shadcn@latest add <component-name>
```

The `components.json` configuration points to:
- CSS: `packages/ui/src/styles/globals.css`
- Utils alias: `@workspace/ui/lib/utils`
- UI alias: `@workspace/ui/components`
- Style: "new-york" variant

## Environment Variables

**Required Client Variables:**
- `NEXT_PUBLIC_URL` - Application URL (auto-set by Vercel, defaults to localhost:3000 in dev)
- `NEXT_PUBLIC_EMAIL_DOMAIN` - Email domain for contact emails

**Required Server Variables:**
- `DATABASE_URL` - Database connection string
- `RESEND_API_KEY` - Resend API key for email sending
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

**Environment Validation:**
- Set `SKIP_ENV_VALIDATION=1` to skip validation (useful for Docker builds)
- Validation happens at build time and will fail the build if required vars are missing

## Important Notes

- **Package Manager:** Always use `bun` instead of npm/yarn/pnpm
- **Node Version:** Requires Node.js >= 20
- **React Version:** Uses React 19.2.0 (latest)
- **Route Groups:** Next.js routes use parentheses for grouping (e.g., `(home)/page.tsx`)
- **Server Components:** Default to Server Components; use `"use client"` directive only when needed
- **Import Paths:** Use workspace aliases (`@workspace/ui`, `@workspace/eslint-config`, etc.)
- **Authentication:** Configured for Google OAuth (client ID and secret in server env)
