# Admin API [HAB.api.admin]

Administrative operations for user management.

## Entry Points

| Procedure | Description |
|-----------|-------------|
| `admin.listUsers` | Get list of all users |
| `admin.updateUserRole` | Change a user's role |

## UI

Admin features are accessible from:
- `/admin` - Admin dashboard overview
- `/admin/users` - User management interface

## Design Decisions

### Two-Role System

**Choice:** Only two roles: "user" and "admin"

**Rationale:** Simple permission model suitable for small-to-medium applications. Admin has full access, users have standard access.

**Future considerations:**
- Additional roles (moderator, editor) can be added as needed
- Fine-grained permissions can be implemented if required

---

## List Users [HAB.api.admin.list-users]

Retrieves all users in the system (admin only).

### Scenario: List all users [HAB.api.admin.list-users.success]

- WHEN admin requests user list
- THEN returns all users with id, name, email, role, image, createdAt
- AND includes both regular users and admins
- AND ordered by creation date

### Scenario: Reject non-admin access [HAB.api.admin.list-users.unauthorized]

- WHEN non-admin user tries to list users
- THEN throws UNAUTHORIZED error
- AND user list is not revealed

---

## Update User Role [HAB.api.admin.update-role]

Changes a user's role between "user" and "admin".

### Scenario: Promote user to admin [HAB.api.admin.update-role.promote]

- WHEN admin changes user's role to "admin"
- THEN user's role is updated to "admin"
- AND user gains admin privileges
- AND returns updated user object

### Scenario: Demote admin to user [HAB.api.admin.update-role.demote]

- WHEN admin changes admin's role to "user"
- THEN user's role is updated to "user"
- AND user loses admin privileges
- AND returns updated user object

### Scenario: Validate role values [HAB.api.admin.update-role.validate]

- WHEN admin provides role value
- THEN role must be exactly "user" or "admin"
- AND other values are rejected

### Scenario: Reject non-admin access [HAB.api.admin.update-role.unauthorized]

- WHEN non-admin user tries to update roles
- THEN throws UNAUTHORIZED error
- AND user roles are not modified

### Scenario: Require user ID [HAB.api.admin.update-role.require-id]

- WHEN admin provides userId
- THEN userId must be a valid user identifier
- AND must refer to existing user
