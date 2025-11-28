## Context

Adding an admin dashboard requires careful security design. The key constraint is that non-admin users should see a 404 page (not "unauthorized") to hide the admin interface's existence. This affects both the route protection strategy and the API authorization approach.

### Stakeholders
- Developers extending the admin functionality
- Site administrators managing users
- End users (should never know /admin exists)

## Goals / Non-Goals

**Goals:**
- Secure admin-only access with 404 masking for non-admins
- User listing with role management capabilities
- Clean sidebar layout with logout functionality
- Extensible pattern for adding more admin features

**Non-Goals:**
- Full Better Auth admin plugin integration (adds schema complexity)
- User banning/impersonation (can be added later)
- Audit logging (future enhancement)
- Multi-tenant admin (out of scope)

## Decisions

### 1. Route Protection Strategy

**Decision:** Use Next.js Server Component with `notFound()` call in layout

**Rationale:**
- Server-side check before any rendering occurs
- Returns actual 404 response, indistinguishable from missing page
- No client-side JavaScript needed for protection
- Pattern: Check session in `app/admin/layout.tsx`, call `notFound()` if not admin

**Alternatives Considered:**
- Middleware redirect → Reveals route exists via redirect
- Client-side check → Exposes route structure, requires loading state
- API route wrapper → Adds complexity, doesn't help with page rendering

### 2. Admin Role Check

**Decision:** Simple role string comparison (`user.role === "admin"`)

**Rationale:**
- Already have `role` field in user schema with default "user"
- Better Auth config already defines role as additional field
- No database migration needed
- Sufficient for MVP admin access control

**Alternatives Considered:**
- Better Auth admin plugin → Requires schema migration, adds complexity
- Permission-based RBAC → Over-engineering for current needs

### 3. Admin oRPC Procedures

**Decision:** Create new `adminProcedure` extending `protectedProcedure` with role check

**Rationale:**
- Consistent with existing middleware pattern
- Reuses auth middleware, adds role validation
- Throws UNAUTHORIZED (appropriate for API, different from 404 for pages)
- Pattern: `adminProcedure.admin.listUsers.handler(...)`

**Implementation:**
```typescript
// packages/api/src/orpc/middleware/auth.ts
const adminMiddleware = implement(contract)
  .$context<AuthenticatedContext>()
  .middleware(async ({ context, next, errors }) => {
    if (context.user.role !== "admin") {
      throw errors.unauthorized({
        data: { message: "Admin access required" },
      })
    }
    return next({ context })
  })

export const adminProcedure = protectedProcedure.use(adminMiddleware)
```

### 4. Admin Layout Structure

**Decision:** Fixed left sidebar with collapsible mobile drawer

**Rationale:**
- Standard admin dashboard pattern
- Sidebar provides clear navigation hierarchy
- Consistent with existing MobileNav pattern for responsive behavior
- Logo + nav links + logout button at bottom

**Layout:**
```
┌─────────────────────────────────────────┐
│ [Logo]                                  │
├──────────┬──────────────────────────────┤
│ Sidebar  │ Main Content                 │
│ ──────── │                              │
│ Dashboard│                              │
│ Users    │                              │
│          │                              │
│          │                              │
│ ──────── │                              │
│ [Logout] │                              │
└──────────┴──────────────────────────────┘
```

### 5. User Management Features

**Decision:** List users with inline role editing

**Rationale:**
- Simple table/list view of all users
- Show: name, email, role, created date
- Action: dropdown to change role (user/admin)
- No pagination initially (can add when needed)

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| 404 masking could confuse legitimate admins | Show clear error on login page if role mismatch |
| No pagination for large user bases | Add pagination in follow-up if >100 users |
| Role changes take effect immediately | Session cache (5 min) means slight delay |
| No audit trail for admin actions | Future: Add audit logging capability |

## Migration Plan

No database migration required - uses existing `role` field.

**Deployment Steps:**
1. Deploy code changes
2. Manually set first admin user via database: `UPDATE users SET role = 'admin' WHERE email = 'admin@example.com'`
3. Future: Add admin creation flow or CLI command

**Rollback:**
- Remove route group - admin pages become 404
- No data changes required

## Open Questions

1. **Should we add a way to create the first admin?** Current approach requires manual database update. Could add env var `ADMIN_EMAILS` that auto-promotes users on first login.
   - **Recommendation:** Keep manual for now, document in README
