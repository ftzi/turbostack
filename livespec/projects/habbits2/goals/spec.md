# Goals Tracking [HAB.goals]

Goal management interface for tracking long-term self-improvement objectives.

## Entry Points

| Route | Description |
|-------|-------------|
| `/goals` | Goals tracking page |

## UI

Goals page displays:
- **Add New Goal card** - Form at top with title input, description textarea, Add Goal button, "Get AI Help" button
- **Goal grid** - Card-based layout showing active goals
- **Goal cards** - Each with icon, title, description, menu (edit/delete), "Get AI Suggestions" button
- **Edit mode** - Inline editing within goal cards

---

## Goal Display [HAB.goals.display]

Goals are displayed in a responsive card grid.

### Scenario: Display active goals [HAB.goals.display.active]

- WHEN user views goals page
- THEN displays all user's goals in grid layout
- AND each goal shows in card with icon, title, description
- AND goals ordered by creation date (newest first)

### Scenario: Empty state [HAB.goals.display.empty]

- WHEN user has no goals
- THEN displays empty state with Target icon
- AND shows message "No goals yet"
- AND suggests creating first goal

### Scenario: Responsive grid [HAB.goals.display.grid]

- WHEN viewing on different screen sizes
- THEN grid adapts: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)

---

## Goal Creation [HAB.goals.create]

Users create goals through form at top of page.

### Scenario: Create goal with title [HAB.goals.create.title]

- WHEN user enters title and clicks "Add Goal"
- THEN goal is created via API
- AND new goal appears in grid
- AND success notification displays
- AND form clears

### Scenario: Create goal with description [HAB.goals.create.description]

- WHEN user enters both title and description
- THEN goal is created with both fields
- AND description displays in goal card

### Scenario: Require title [HAB.goals.create.require]

- WHEN user tries to create goal without title
- THEN "Add Goal" button is disabled
- AND goal cannot be submitted

### Scenario: Title validation [HAB.goals.create.validate]

- WHEN user provides title
- THEN whitespace-only titles are rejected
- AND empty titles disable submit button

### Scenario: Press Enter to add [HAB.goals.create.enter]

- WHEN user presses Enter in title field
- THEN goal is created (if valid)
- AND form clears for next goal

### Scenario: Disable during creation [HAB.goals.create.disable]

- WHEN goal creation is in progress
- THEN form inputs are disabled
- AND buttons are disabled
- AND prevents duplicate submissions

---

## Goal Editing [HAB.goals.edit]

Users can edit goal title and description inline.

### Scenario: Start editing [HAB.goals.edit.start]

- WHEN user clicks "Edit" in goal menu
- THEN goal card switches to edit mode
- AND title input shows current title
- AND description textarea shows current description
- AND inputs are focused

### Scenario: Save changes [HAB.goals.edit.save]

- WHEN user clicks "Save" button
- THEN updated goal is saved via API
- AND edit mode closes
- AND goal card shows updated content
- AND success notification displays

### Scenario: Cancel editing [HAB.goals.edit.cancel]

- WHEN user clicks "Cancel" button
- THEN edit mode closes without saving
- AND original values are restored
- AND goal card returns to display mode

### Scenario: Require title when editing [HAB.goals.edit.require]

- WHEN editing goal
- THEN "Save" button is disabled if title is empty
- AND prevents saving invalid goal

---

## Goal Deletion [HAB.goals.delete]

Users can delete goals via dropdown menu.

### Scenario: Delete goal [HAB.goals.delete.confirm]

- WHEN user clicks "Delete" in goal menu
- THEN goal is deleted via API
- AND goal is removed from grid
- AND success notification displays
- AND grid re-flows to fill space

### Scenario: Error on delete [HAB.goals.delete.error]

- WHEN goal deletion fails
- THEN error notification displays
- AND goal remains in grid
- AND user can retry

---

## Goal Menu [HAB.goals.menu]

Each goal card has dropdown menu for actions.

### Scenario: Open menu [HAB.goals.menu.open]

- WHEN user clicks three-dot menu button
- THEN dropdown menu opens
- AND displays Edit and Delete options

### Scenario: Edit option [HAB.goals.menu.edit]

- WHEN user selects "Edit" from menu
- THEN goal enters edit mode

### Scenario: Delete option [HAB.goals.menu.delete]

- WHEN user selects "Delete" from menu
- THEN goal is deleted
- AND delete option is styled in red for warning

---

## AI Assistance (Placeholder) [HAB.goals.ai]

AI assistance features are placeholders for future functionality.

### Scenario: AI Help button in form [HAB.goals.ai.form]

- WHEN user clicks "Get AI Help" in add goal form
- THEN button is present and clickable
- AND functionality is placeholder for future AI feature

### Scenario: AI Suggestions for goal [HAB.goals.ai.suggestions]

- WHEN user clicks "Get AI Suggestions" in goal card
- THEN button is present and clickable
- AND functionality is placeholder for future AI coaching

---

## Error Handling [HAB.goals.errors]

Goal operations handle errors gracefully.

### Scenario: Creation error [HAB.goals.errors.create]

- WHEN goal creation fails
- THEN error toast notification displays with message
- AND form remains filled for retry
- AND user can attempt creation again

### Scenario: Update error [HAB.goals.errors.update]

- WHEN goal update fails
- THEN error toast notification displays
- AND original goal data is preserved
- AND edit mode closes

### Scenario: Delete error [HAB.goals.errors.delete]

- WHEN goal deletion fails
- THEN error toast notification displays
- AND goal remains in grid

---

## Goal Metadata [HAB.goals.metadata]

Goal cards display creation date.

### Scenario: Show creation date [HAB.goals.metadata.date]

- WHEN goal is displayed
- THEN shows "Created [date]" in card footer
- AND date is formatted in locale-appropriate format
- AND uses localized date string
