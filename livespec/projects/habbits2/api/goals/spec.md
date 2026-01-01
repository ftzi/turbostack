# Goals API [HAB.api.goals]

Goal tracking and management for long-term objectives.

## Entry Points

| Procedure | Description |
|-----------|-------------|
| `goals.getAll` | Get all goals for authenticated user |
| `goals.create` | Create a new goal |
| `goals.update` | Update an existing goal |
| `goals.delete` | Delete a goal |

## UI

Goals are displayed in the goals dashboard with:
- List of all active goals
- Goal details (title, description)
- Creation and update timestamps

## Design Decisions

### Simple Goal Structure

**Choice:** Goals have only title and description fields

**Rationale:** Start with minimal viable structure. Additional fields (progress, deadline, subtasks) can be added as needed based on user feedback.

**Alternatives considered:**
- Adding progress tracking → Deferred until usage patterns emerge
- Adding completion status → Can leverage events for milestone tracking
- Adding goal categories → Can reuse event categories if needed

---

## Get All Goals [HAB.api.goals.get-all]

Retrieves all goals for the authenticated user.

### Scenario: Get user goals [HAB.api.goals.get-all.basic]

- WHEN user requests all goals
- THEN returns all goals owned by authenticated user
- AND goals are ordered by creation date (newest first)
- AND each goal includes id, title, description, timestamps

### Scenario: Empty goals list [HAB.api.goals.get-all.empty]

- WHEN user has no goals
- THEN returns empty array
- AND does not throw error

---

## Create Goal [HAB.api.goals.create]

Creates a new goal for the authenticated user.

### Scenario: Create goal with title [HAB.api.goals.create.basic]

- WHEN user creates goal with title
- THEN goal is created with user as owner
- AND goal has unique UUID
- AND timestamps (createdAt, updatedAt) are set to current time
- AND description is optional

### Scenario: Create goal with description [HAB.api.goals.create.with-description]

- WHEN user creates goal with title and description
- THEN goal is created with both fields
- AND description provides additional context

### Scenario: Require title [HAB.api.goals.create.require-title]

- WHEN user tries to create goal without title
- THEN validation error is thrown
- AND goal is not created

### Scenario: Title length validation [HAB.api.goals.create.title-length]

- WHEN user provides title
- THEN title must be between 1 and 200 characters
- AND empty string is rejected
- AND exceeding 200 characters is rejected

---

## Update Goal [HAB.api.goals.update]

Updates an existing goal's properties.

### Scenario: Update goal title [HAB.api.goals.update.title]

- WHEN user updates goal title
- THEN title is changed to new value
- AND updatedAt timestamp is updated
- AND other properties remain unchanged

### Scenario: Update goal description [HAB.api.goals.update.description]

- WHEN user updates goal description
- THEN description is changed to new value
- AND updatedAt timestamp is updated

### Scenario: Partial update [HAB.api.goals.update.partial]

- WHEN user updates only some fields
- THEN only specified fields are changed
- AND unspecified fields retain original values

### Scenario: Prevent updating other users' goals [HAB.api.goals.update.ownership]

- WHEN user tries to update goal owned by different user
- THEN operation fails with error
- AND goal is not modified

---

## Delete Goal [HAB.api.goals.delete]

Permanently removes a goal.

### Scenario: Delete existing goal [HAB.api.goals.delete.success]

- WHEN user deletes goal by ID
- THEN goal is permanently removed from database
- AND no return value (void)
- AND goal cannot be retrieved afterwards

### Scenario: Prevent deleting other users' goals [HAB.api.goals.delete.ownership]

- WHEN user tries to delete goal owned by different user
- THEN operation fails with error
- AND goal is not deleted
