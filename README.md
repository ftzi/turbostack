<div align="center">

<br/>
<img src="logo.png" alt="Turbostack Logo" width="250"/>

<!-- # Turbostack -->

<h4>

A modern, full-stack TypeScript monorepo starter with [Next.js 16](https://nextjs.org/), [React 19](https://react.dev/), [Better Auth](https://www.better-auth.com/), [oRPC](https://orpc.unnoq.com/), and [Drizzle ORM](https://orm.drizzle.team/).

</h4>

<br/>

</div>

## ✨ Features

- **Monorepo Architecture** - Turborepo with Bun for fast, scalable development
- **Next.js 16** - App Router with React Server Components and React Compiler
- **Type-Safe API** - oRPC for end-to-end type safety between client and server
- **Authentication** - Better Auth with Drizzle adapter
- **Database** - Drizzle ORM with Neon serverless PostgreSQL
- **UI Components** - shadcn/ui with Radix UI primitives
- **Modern Tooling** - Biome for linting, TypeScript 5.9, Tailwind CSS 4.1

## 🚀 Quick Start

### Prerequisites

- Bun

### Setup

1. **Install dependencies**

   ```bash
   bun install
   ```

2. **Configure environment variables**

   ```bash
   bun env
   ```

3. **Set up the database**

   ```bash
   bun db:migrate    # Run migrations
   ```

4. **Start development**

   ```bash
   bun dev
   ```

## 📦 Monorepo Structure

```
apps/
  web/              Next.js 16 application
packages/
  api/              Backend logic (auth, oRPC, database)
  email/            Email templates
  shared/           Shared utilities and configuration
  ui/               UI component library
  typescript-config/ Shared TypeScript configs
```

## 🛠️ Common Commands

```bash
bun dev           # Start dev server with TypeScript watch mode
bun ok            # Type check + lint (run this before commits!)
bun build         # Build all apps and packages
bun ts            # Type check all workspaces
bun lint          # Format and lint with Biome
bun knip          # Find unused files and dependencies

# Database commands
bun db:studio     # Open Drizzle Studio
bun db:generate   # Generate migrations (after schema changes)
bun db:migrate    # Run migrations
```

## 📚 Tech Stack

- **Framework**: Next.js 16, React 19.2
- **Language**: TypeScript 5.9
- **API**: oRPC with TanStack Query
- **Database**: Drizzle ORM + Neon
- **Auth**: Better Auth
- **UI**: shadcn/ui + Tailwind CSS 4.1
- **Tooling**: Turborepo, Bun, Biome
- **Email**: React Email + Resend

## 📖 Documentation

For detailed information about the project architecture, conventions, and workflows, see [CLAUDE.md](CLAUDE.md).
