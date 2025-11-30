## Context

Turbostack needs a complete template UI that serves as a starting point for new projects. The UI must be beautiful, responsive, and theme-aware while maintaining excellent developer experience.

**Stakeholders**: Template users (developers), end users of apps built with the template

**Constraints**:
- Must use existing stack (Tailwind CSS 4.1, Radix UI, shadcn patterns)
- No new dependencies unless absolutely necessary
- All components must support light/dark themes via CSS variables
- All layouts must be responsive (mobile-first)

## Goals / Non-Goals

**Goals:**
- Provide production-ready header, footer, and page layouts
- Create a visually appealing landing page with common sections
- Include legal page templates with AI generation guidance
- Add custom error pages for better UX
- Establish patterns for responsive and theme-aware components

**Non-Goals:**
- Dashboard/authenticated app layout (future work - open question)
- Newsletter signup functionality
- Cookie consent banner
- CMS integration
- i18n/localization

## Decisions

### 1. Header Behavior Configuration

**Decision**: Use a constant `STICKY_HEADER` in `packages/shared/src/consts.ts` (default: `true`)

**Rationale**: Sticky headers improve navigation UX on long pages. Making it configurable allows projects with different needs to easily change behavior.

**Alternatives considered**:
- Component prop only: Less discoverable, requires prop drilling
- CSS-only toggle: Harder to conditionally render different layouts

### 2. Mobile Navigation Pattern

**Decision**: Hamburger menu with slide-out drawer using Radix Dialog

**Rationale**: Familiar pattern, accessible by default with Radix, works well with existing component library.

**Alternatives considered**:
- Bottom navigation bar: More modern but less conventional for marketing sites
- Dropdown menu: Less touch-friendly, harder to navigate deep menus

### 3. Landing Page Architecture

**Decision**: Modular section components that can be composed in page.tsx

**Rationale**: Allows template users to easily reorder, remove, or customize sections.

**Structure**:
```
components/landing/
  Hero.tsx
  Features.tsx
  Testimonials.tsx
  CTA.tsx
```

### 4. Legal Pages Content Strategy

**Decision**: Include placeholder Lorem-style content with prominent AI prompt comments

**Rationale**: Provides visual structure while making it obvious content needs replacement. AI prompts help developers generate appropriate content quickly.

**Format**:
```tsx
{/*
AI PROMPT: Generate a Privacy Policy for [YOUR APP NAME], a [DESCRIPTION].
Include sections for: data collection, usage, sharing, security, user rights, contact info.
Jurisdiction: [YOUR COUNTRY/STATE]
*/}
```

### 5. Error Pages Implementation

**Decision**: Use Next.js App Router conventions (not-found.tsx, error.tsx, global-error.tsx)

**Rationale**: Native Next.js patterns, automatic integration, proper error boundaries.

### 6. Component Organization

**Decision**: Layout components in `packages/ui/`, page-specific sections in `apps/web/components/landing/`

**Rationale**: Reusable layout primitives (Header, Footer) belong in the shared UI package. Landing page sections are app-specific and belong in the web app.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Over-designed landing page may not fit all use cases | Keep sections modular and easily removable |
| Legal placeholder content might be used as-is | Make AI prompts prominent, add console warning in dev |
| Sticky header may cause issues with anchor links | Add scroll-margin-top to sections |
| Mobile menu might conflict with future sidebar | Design with composition in mind |

## Migration Plan

Not applicable - new feature addition, no existing code to migrate.

## Open Questions

1. **Dashboard Layout**: Should we add a separate authenticated app layout with sidebar? (Deferred to future proposal)
2. **Animation Library**: Should landing page sections have scroll-triggered animations? (Starting without, can add later)
