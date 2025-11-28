# Change: Add Admin Dashboard

## Why

Applications need a secure admin interface to manage users. Currently there's no way for administrators to view, manage, or moderate the user base. The admin page must be completely hidden from non-admin users (returning 404) to avoid revealing its existence.

## What Changes

- **Admin Routes**: New `app/admin/` directory with dedicated layout containing left sidebar navigation
- **Admin Authorization**: Server-side role check that returns 404 for non-admin users (security through obscurity)
- **Admin Layout**: Left sidebar with navigation links and logout button, responsive design
- **User Management Page**: List all users with ability to view details and update roles
- **Admin oRPC Procedures**: New `admin` procedure domain with `listUsers` and `updateUserRole` endpoints
- **Admin Middleware**: New `adminProcedure` that extends `protectedProcedure` with role check

## Impact

- Affected specs: New capability (admin-dashboard)
- Affected code:
  - `apps/web/app/admin/` - Admin layout and pages
  - `packages/api/src/orpc/procedures/admin/` - Admin-specific oRPC procedures
  - `packages/api/src/orpc/middleware/auth.ts` - New `adminProcedure` implementer
  - `packages/api/src/orpc/contract/index.ts` - Add admin contract composition
  - `packages/ui/src/components/` - Admin sidebar component (optional, may inline)

## Security Considerations

- **404 for Non-Admins**: Non-authenticated and non-admin users see 404 page, not "unauthorized"
- **Server-Side Validation**: All admin checks happen server-side, never trust client
- **Role Check in Middleware**: oRPC admin procedures use dedicated middleware that throws UNAUTHORIZED
- **No Client-Side Route Protection**: The 404 is rendered server-side before any client code runs
