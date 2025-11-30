## 1. Backend - Admin Authorization

- [x] 1.1 Add `adminMiddleware` to `packages/api/src/orpc/middleware/auth.ts` that checks `user.role === "admin"`
- [x] 1.2 Export `adminProcedure` that chains `protectedProcedure` with `adminMiddleware`
- [x] 1.3 Create `packages/api/src/orpc/procedures/admin/admin.contract.ts` with `listUsers` and `updateUserRole` contracts
- [x] 1.4 Create `packages/api/src/orpc/procedures/admin/admin.handler.ts` implementing both procedures
- [x] 1.5 Add admin contract to main contract composition in `packages/api/src/orpc/contract/index.ts`
- [x] 1.6 Write tests for admin procedures in `admin.test.ts`

## 2. Frontend - Admin Layout

- [x] 2.1 Create `apps/web/app/admin/layout.tsx` with server-side admin check returning `notFound()`
- [x] 2.2 Create admin sidebar component with navigation links (Dashboard, Users) and logout button
- [x] 2.3 Style sidebar: fixed left position on desktop, drawer on mobile
- [x] 2.4 Add logout functionality using `authClient.signOut()`

## 3. Frontend - Admin Pages

- [x] 3.1 Create `apps/web/app/admin/page.tsx` as dashboard landing page
- [x] 3.2 Create `apps/web/app/admin/users/page.tsx` for user management
- [x] 3.3 Implement user list with TanStack Query using `orpc.admin.listUsers`
- [x] 3.4 Add role change dropdown using `orpc.admin.updateUserRole` mutation
- [x] 3.5 Add loading states and error handling with toast notifications

## 4. Validation

- [x] 4.1 Run `bun ok` to verify types and linting pass
