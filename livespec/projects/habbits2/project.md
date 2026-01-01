# Habbits2

A comprehensive habit and wellness tracking application built with Next.js 16, oRPC, and Better Auth.

## Overview

Habbits2 is a full-stack web application for tracking habits, tasks, goals, and wellness activities. It provides a dashboard-based interface for managing multiple aspects of personal wellness including health, sleep, physical activity, personal care, pets, and purchases.

## Codebase

- **Location:** Monorepo structure
  - `apps/web/` - Next.js 16 frontend with App Router
  - `packages/api/` - oRPC backend procedures and Better Auth
  - `packages/server/` - Database schema and server-only code
  - `packages/ui/` - Shared UI component library (shadcn-based)
  - `packages/shared/` - Shared utilities and constants
- **Spec Code:** HAB

## Domain Knowledge

### Key Concepts

- **Events** - Calendar events and tasks with categories (work, personal, health, learning, other), support for recurring events, and completion tracking
- **Goals** - Long-term objectives that users can track
- **Wellness Categories** - Organized areas for habit tracking: health, sleep, physical activity, personal care, pets, purchases
- **User Roles** - Standard users and admin users with elevated permissions

### Authentication

- Uses Better Auth with flexible authentication methods:
  - Google OAuth (when credentials configured)
  - Magic link email (via Resend when configured, console fallback otherwise)
  - Email/password (fallback when no OAuth configured)
- Session management with token-based authentication
- Admin role for user management

### Data Model

- **users** - User accounts with email, role, and profile information
- **sessions** - Active authentication sessions
- **accounts** - OAuth provider accounts linked to users
- **events** - Tasks and calendar events with recurrence support
- **goals** - User-defined goals with descriptions

### Technical Stack

- **Frontend:** Next.js 16 with App Router, React 19.2, React Server Components
- **API:** oRPC with contract-first approach, TanStack Query integration
- **Database:** Drizzle ORM with PGlite (local) or Neon (production)
- **Auth:** Better Auth with multiple providers
- **UI:** shadcn/ui components with Radix UI primitives, Tailwind CSS 4.1
- **Package Manager:** Bun 1.3.1

## Entry Points

### Public Routes

| Route | Feature | Description |
|-------|---------|-------------|
| `/` | [HAB.home] | Public landing page |
| `/privacy` | [HAB.legal] | Privacy policy |
| `/terms` | [HAB.legal] | Terms of service |
| `/auth` | Better Auth | Authentication pages (handled by Better Auth at `/api/auth/[...all]`) |

### Authenticated Routes

#### Core Features

| Route | Feature | Description |
|-------|---------|-------------|
| `/dashboard` | [HAB.dashboard] | Main authenticated dashboard overview |
| `/calendar` | [HAB.calendar] | Calendar view for events and tasks |
| `/tasks` | [HAB.tasks] | Task management interface |
| `/goals` | [HAB.goals] | Goal tracking and management |

#### Wellness Tracking

| Route | Feature | Description |
|-------|---------|-------------|
| `/health` | [HAB.wellness.health] | Health tracking dashboard |
| `/sleep` | [HAB.wellness.sleep] | Sleep tracking interface |
| `/physical` | [HAB.wellness.physical] | Physical activity tracking |
| `/nutrition` | [HAB.wellness.nutrition] | Nutrition and diet tracking |
| `/mind` | [HAB.wellness.mind] | Mental wellness and mindfulness |
| `/mindset` | [HAB.wellness.mindset] | Mindset and mental frameworks |
| `/self-esteem` | [HAB.wellness.self-esteem] | Self-esteem and confidence building |
| `/personal-care` | [HAB.wellness.personal-care] | Personal care habit tracking |
| `/social` | [HAB.wellness.social] | Social connections and relationships |
| `/pets` | [HAB.wellness.pets] | Pet care tracking |
| `/groceries` | [HAB.wellness.groceries] | Grocery shopping and meal planning |
| `/purchases` | [HAB.wellness.purchases] | Purchase tracking |

#### Settings & Admin

| Route | Feature | Description |
|-------|---------|-------------|
| `/settings` | [HAB.settings] | User settings and preferences |
| `/admin` | [HAB.admin] | Admin dashboard for user management (admin only) |
| `/admin/users` | [HAB.admin.users] | User management interface (admin only) |

### API Routes

| Route | Feature | Description |
|-------|---------|-------------|
| `/api/auth/[...all]` | Better Auth | Authentication API endpoints |
| `/api/rpc/[[...rest]]` | oRPC | Main API endpoint for all procedures |
| `/api/og` | OpenGraph | Dynamic OG image generation |
| `/api/icon` | Favicon | Dynamic favicon generation |

### API Procedures

| Procedure | Feature | Description |
|-----------|---------|-------------|
| `auth.*` | [HAB.api.auth] | Authentication procedures (ping) |
| `user.*` | [HAB.api.user] | User profile management |
| `events.*` | [HAB.api.events] | Event and task CRUD operations |
| `goals.*` | [HAB.api.goals] | Goal management operations |
| `admin.*` | [HAB.api.admin] | Admin operations for user management |

## Conventions

### Code Organization

- **Route groups:** Use parentheses for logical grouping (e.g., `(dashboard)/`, `(home)/`)
- **Server components by default:** Only use `"use client"` when necessary
- **Collocated tests:** Place test files next to source files (e.g., `handler.ts` → `handler.test.ts`)
- **Contract-first API:** Define oRPC contracts before implementations

### Testing

- **Unit tests preferred:** Use unit tests by default (fast, isolated)
- **E2E tests:** Playwright for end-to-end browser testing
  - Run with: `bun e2e` (headless), `bun e2e:headed` (with browser), `bun e2e:ui` (interactive UI)
  - Tests located in: `tests/e2e/`
  - Configuration: `playwright.config.ts` at project root
- **Spec references required:** All tests must include `@spec [HAB.feature.scenario]` annotations
- **Test runner:** Bun's built-in test runner for unit tests, Playwright for e2e tests

### Database

- **Schema changes workflow:**
  1. Edit `packages/server/src/db/schema.ts`
  2. User runs `bun db:generate` manually (requires interactive input)
  3. User runs `bun db:migrate` to apply migrations
- **Index management:** All Better Auth indexes are manually managed in schema.ts
- **NEVER use** `@better-auth/cli generate` - it will remove manual indexes

### UI Patterns

- **Mobile-first:** All pages must be responsive (375px+, 768px+, 1280px+)
- **Theme support:** All components support light and dark themes
- **shadcn components:** Use existing UI components from `packages/ui/`
- **Error handling:** Use `getErrorMessage()` from `@workspace/shared/utils/error`
