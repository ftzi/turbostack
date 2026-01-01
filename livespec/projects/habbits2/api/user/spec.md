# User Profile API [HAB.api.user]

User profile management for authenticated users.

## Entry Points

| Procedure | Description |
|-----------|-------------|
| `user.getCurrentUser` | Get current authenticated user's profile |
| `user.updateUser` | Update user profile information |

## UI

User profile is displayed in:
- Settings page for profile management
- Navigation header showing current user
- Admin dashboard showing user list

## Design Decisions

### Minimal Profile Fields

**Choice:** Profile includes only name and image

**Rationale:** Start with essential fields. Email is immutable (managed by auth system). Additional profile fields can be added based on user needs.

---

## Get Current User [HAB.api.user.get-current]

Retrieves the authenticated user's profile information.

### Scenario: Get authenticated user profile [HAB.api.user.get-current.success]

- WHEN authenticated user requests current user
- THEN returns user profile with id, name, email, image, timestamps
- AND email is the user's verified email address
- AND image is optional profile picture URL

### Scenario: Return null when not authenticated [HAB.api.user.get-current.not-authenticated]

- WHEN endpoint is called without authentication
- THEN returns null
- AND does not throw error

---

## Update User Profile [HAB.api.user.update]

Updates the authenticated user's profile information.

### Scenario: Update user name [HAB.api.user.update.name]

- WHEN user updates their name
- THEN name is changed to new value
- AND updatedAt timestamp is updated
- AND returns updated user object

### Scenario: Update profile image [HAB.api.user.update.image]

- WHEN user updates their profile image
- THEN image URL is changed to new value
- AND image must be valid URL or null
- AND returns updated user object

### Scenario: Clear profile image [HAB.api.user.update.clear-image]

- WHEN user sets image to null
- THEN profile image is cleared
- AND user has no profile picture

### Scenario: Name validation [HAB.api.user.update.name-validation]

- WHEN user provides name
- THEN name must be between 1 and 100 characters
- AND empty string is rejected
- AND exceeding 100 characters is rejected

### Scenario: Partial update [HAB.api.user.update.partial]

- WHEN user updates only some fields
- THEN only specified fields are changed
- AND unspecified fields retain original values

### Scenario: Only update own profile [HAB.api.user.update.ownership]

- WHEN user calls updateUser
- THEN only their own profile is updated
- AND cannot modify other users' profiles
