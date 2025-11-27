# Change: Add Template UI

## Why

Turbostack is a template project but lacks essential UI scaffolding. Developers cloning this template need a polished, production-ready starting point with header, footer, landing page, legal pages, and error pages. Without these, every user must build common UI patterns from scratch.

## What Changes

- **Site Layout Components**: Header with navigation (sticky by default, configurable), mobile hamburger menu, footer with logo/links/social/copyright
- **Landing Page**: Hero section, features grid, testimonials, CTA sections - modern, professional design
- **Legal Pages**: Privacy Policy and Terms of Service with placeholder content and AI generation prompts
- **Error Pages**: Custom 404 and 500 pages using Next.js conventions
- **Documentation**: Update CLAUDE.md with responsiveness and theme requirements; add README info

## Impact

- Affected specs: New capabilities (site-layout, landing-page, legal-pages, error-pages)
- Affected code:
  - `packages/ui/src/components/` - New layout components (Header, Footer, MobileNav, etc.)
  - `apps/web/app/(home)/` - Landing page sections, legal pages
  - `apps/web/app/` - Error pages (not-found.tsx, error.tsx, global-error.tsx)
  - `packages/shared/src/consts.ts` - Layout configuration constants
  - `CLAUDE.md` - Add responsiveness/theme conventions

## Design Principles

- **Responsive-first**: All components MUST work on mobile, tablet, and desktop
- **Theme-friendly**: All components MUST support light and dark modes using CSS variables
- **Minimal dependencies**: Use existing Tailwind/Radix stack, no new UI libraries
- **DX-focused**: Clear component APIs, sensible defaults, easy customization
