# Admin Features [HAB.admin]

Administrative interface for user management (admin access only).

## Entry Points

| Route | Description |
|-------|-------------|
| `/admin` | Admin dashboard overview |
| `/admin/users` | User management interface |

## UI

Admin pages use dashboard layout with admin-specific content.

---

## Admin Dashboard [HAB.admin.dashboard]

Overview page for admin users.

### Scenario: Admin access only [HAB.admin.dashboard.auth]

- WHEN non-admin user tries to access /admin
- THEN access is denied and user redirected
- AND appropriate error message displays

### Scenario: Display admin overview [HAB.admin.dashboard.display]

- WHEN admin user accesses /admin
- THEN admin dashboard displays
- AND shows admin-specific statistics or navigation

---

## User Management [HAB.admin.users]

Interface for managing system users and roles.

### Scenario: List all users [HAB.admin.users.list]

- WHEN admin views /admin/users
- THEN displays list of all system users
- AND shows user details (name, email, role, created date)

### Scenario: Update user role [HAB.admin.users.role]

- WHEN admin changes user's role
- THEN role is updated via API
- AND user list refreshes
- AND confirmation message displays

### Scenario: Admin-only access [HAB.admin.users.auth]

- WHEN non-admin tries to access user management
- THEN access is denied
- AND user is redirected to appropriate page

---

## Admin Authorization [HAB.admin.auth]

All admin features require admin role.

### Scenario: Check admin role [HAB.admin.auth.check]

- WHEN user accesses admin route
- THEN system verifies user has admin role
- AND grants access only if role is "admin"

### Scenario: Deny non-admin access [HAB.admin.auth.deny]

- WHEN user without admin role tries to access admin features
- THEN access is denied
- AND user sees unauthorized error
