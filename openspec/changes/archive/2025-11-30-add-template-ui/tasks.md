## 1. Foundation & Documentation

- [x] 1.1 Add `STICKY_HEADER` constant to `packages/shared/src/consts.ts`
- [x] 1.2 Update CLAUDE.md with responsiveness and theme conventions
- [x] 1.3 Add template UI section to README info (for future README generation)

## 2. Layout Components (packages/ui/)

- [x] 2.1 Create `Header` component with logo, nav links, theme toggle, and auth button slot
- [x] 2.2 Create `MobileNav` component with hamburger trigger and slide-out drawer
- [x] 2.3 Create `Footer` component with logo, nav columns, social links, and copyright
- [x] 2.4 Create `Container` component for consistent max-width and padding
- [x] 2.5 Create `Section` component for landing page sections with consistent spacing

## 3. Landing Page (apps/web/)

- [x] 3.1 Create `Hero` section with headline, subheadline, CTA buttons, and visual element
- [x] 3.2 Create `Features` section with icon grid (6 features)
- [x] 3.3 Create `Testimonials` section with quote cards
- [x] 3.4 Create `CTA` section with final call-to-action
- [x] 3.5 Compose sections in `app/(home)/page.tsx`
- [x] 3.6 Add Header and Footer to `app/(home)/layout.tsx`

## 4. Legal Pages

- [x] 4.1 Create `app/(home)/privacy/page.tsx` with placeholder content and AI prompt
- [x] 4.2 Create `app/(home)/terms/page.tsx` with placeholder content and AI prompt
- [x] 4.3 Add legal page links to Footer component

## 5. Error Pages

- [x] 5.1 Create `app/not-found.tsx` (404 page)
- [x] 5.2 Create `app/error.tsx` (client error boundary)
- [x] 5.3 Create `app/global-error.tsx` (root error boundary)

## 6. Verification

- [x] 6.1 Run `bun ok` to verify type checking and linting pass
