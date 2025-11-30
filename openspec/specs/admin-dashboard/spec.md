# admin-dashboard Specification

## Purpose
TBD - created by archiving change add-admin-page. Update Purpose after archive.
## Requirements
### Requirement: Admin Route Protection

The system SHALL return a 404 response for the `/admin` route when accessed by non-authenticated users or users without the "admin" role.

#### Scenario: Non-authenticated user visits admin page
- **WHEN** a user without a session navigates to `/admin`
- **THEN** the server responds with HTTP 404 status
- **AND** the standard 404 page is displayed

#### Scenario: Authenticated non-admin user visits admin page
- **WHEN** a user with role "user" navigates to `/admin`
- **THEN** the server responds with HTTP 404 status
- **AND** the standard 404 page is displayed

#### Scenario: Admin user visits admin page
- **WHEN** a user with role "admin" navigates to `/admin`
- **THEN** the admin dashboard is displayed
- **AND** the admin sidebar navigation is visible

### Requirement: Admin Sidebar Navigation

The admin layout SHALL include a left sidebar with navigation links and a logout button.

#### Scenario: Admin views sidebar on desktop
- **WHEN** an admin user views any admin page on desktop (>=1024px width)
- **THEN** a fixed left sidebar is visible
- **AND** the sidebar contains the application logo
- **AND** the sidebar contains navigation links for "Dashboard" and "Users"
- **AND** the sidebar contains a logout button at the bottom

#### Scenario: Admin views sidebar on mobile
- **WHEN** an admin user views any admin page on mobile (<1024px width)
- **THEN** a hamburger menu icon is visible in the header
- **AND** clicking the icon opens a slide-out drawer with navigation links
- **AND** the drawer contains the logout button

#### Scenario: Admin logs out
- **WHEN** an admin clicks the logout button
- **THEN** the user session is terminated
- **AND** the user is redirected to the home page

### Requirement: User Listing

The admin dashboard SHALL provide a list of all users in the system.

#### Scenario: Admin views user list
- **WHEN** an admin navigates to `/admin/users`
- **THEN** a list of all users is displayed
- **AND** each user entry shows: name, email, role, and created date

#### Scenario: User list loading state
- **WHEN** the user list is being fetched
- **THEN** a loading skeleton is displayed

#### Scenario: User list empty state
- **WHEN** there are no users in the system
- **THEN** an appropriate empty state message is displayed

### Requirement: User Role Management

The admin dashboard SHALL allow administrators to change user roles.

#### Scenario: Admin changes user role
- **WHEN** an admin selects a new role for a user from the dropdown
- **THEN** an API request is made to update the user's role
- **AND** on success, a confirmation toast is displayed
- **AND** the user list reflects the updated role

#### Scenario: Admin cannot change own role
- **WHEN** viewing the user list
- **THEN** the current admin's role dropdown is disabled
- **AND** a tooltip explains that admins cannot demote themselves

#### Scenario: Role change fails
- **WHEN** a role update API request fails
- **THEN** an error toast is displayed with the error message
- **AND** the role dropdown reverts to the previous value

### Requirement: Admin API Authorization

The admin oRPC procedures SHALL only be accessible to users with the "admin" role.

#### Scenario: Non-admin calls admin API
- **WHEN** a user without "admin" role calls any admin procedure
- **THEN** the procedure returns an UNAUTHORIZED error
- **AND** the error message indicates "Admin access required"

#### Scenario: Non-authenticated calls admin API
- **WHEN** a request without valid session calls any admin procedure
- **THEN** the procedure returns an UNAUTHORIZED error
- **AND** the error message indicates authentication is required

#### Scenario: Admin calls admin API successfully
- **WHEN** a user with "admin" role calls an admin procedure
- **THEN** the procedure executes normally
- **AND** returns the expected result

### Requirement: List Users Procedure

The system SHALL provide an oRPC procedure to list all users for administrators.

#### Scenario: List users returns all users
- **WHEN** an admin calls the `admin.listUsers` procedure
- **THEN** the procedure returns an array of user objects
- **AND** each user object contains: id, name, email, role, image, createdAt

### Requirement: Update User Role Procedure

The system SHALL provide an oRPC procedure to update a user's role.

#### Scenario: Update role to admin
- **WHEN** an admin calls `admin.updateUserRole` with role "admin"
- **THEN** the target user's role is updated to "admin" in the database
- **AND** the procedure returns the updated user object

#### Scenario: Update role to user
- **WHEN** an admin calls `admin.updateUserRole` with role "user"
- **THEN** the target user's role is updated to "user" in the database
- **AND** the procedure returns the updated user object

#### Scenario: Update non-existent user
- **WHEN** an admin calls `admin.updateUserRole` with an invalid userId
- **THEN** the procedure returns an OPERATION_FAILED error
- **AND** the error message indicates the user was not found

