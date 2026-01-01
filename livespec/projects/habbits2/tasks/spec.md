# Task Management [HAB.tasks]

Task management interface with filtering, editing, and completion tracking.

## Entry Points

| Route | Description |
|-------|-------------|
| `/tasks` | Task management interface |

## UI

Task page consists of:
- **Sidebar** - Filter navigation (Today, Week, Overdue, Completed, Categories)
- **Main content** - Task list with add button
- **Task items** - Checkbox, title (editable), time display, dropdown menu

### Design Requirements

- **Authenticated only** - Requires login
- **Mobile-responsive** - Sidebar adapts to mobile screens
- **Real-time updates** - Task list updates immediately after mutations
- **Inline editing** - Click task title to edit
- **Hover menu** - Task options appear on hover

---

## Task Display [HAB.tasks.display]

Task list displays user's tasks with appropriate filtering.

### Scenario: Display today's tasks [HAB.tasks.display.today]

- WHEN user selects "Today" filter
- THEN displays incomplete tasks scheduled for today
- AND title shows "Today's Tasks"
- AND shows task count in subtitle
- AND incomplete tasks sorted by start time

### Scenario: Display week's tasks [HAB.tasks.display.week]

- WHEN user selects "Week" filter
- THEN displays incomplete tasks for current week
- AND title shows "This Week's Tasks"
- AND shows tasks from today through end of week
- AND tasks show date alongside title

### Scenario: Display overdue tasks [HAB.tasks.display.overdue]

- WHEN user selects "Overdue" filter
- THEN displays incomplete tasks past their end time
- AND title shows "Overdue Tasks"
- AND tasks marked as overdue

### Scenario: Display completed tasks [HAB.tasks.display.completed]

- WHEN user selects "Completed" filter
- THEN displays tasks marked as complete
- AND title shows "Completed Tasks"
- AND completed tasks have strikethrough styling

### Scenario: Filter by category [HAB.tasks.display.category]

- WHEN user selects category filter (work, personal, health, learning, other)
- THEN displays only tasks matching that category
- AND title shows category name
- AND includes tasks across all time periods

### Scenario: Empty state [HAB.tasks.display.empty]

- WHEN selected filter has no tasks
- THEN displays empty state with icon
- AND shows appropriate message for filter type
- AND suggests creating a new task

---

## Task Creation [HAB.tasks.create]

Users can create new tasks through a dialog interface.

### Scenario: Open create dialog [HAB.tasks.create.open]

- WHEN user clicks "Add Task" button
- THEN create event dialog opens
- AND dialog is pre-configured for task creation
- AND form is empty and ready for input

### Scenario: Create basic task [HAB.tasks.create.basic]

- WHEN user enters title and times in dialog
- THEN task is created via events API
- AND task appears in appropriate filter views
- AND success toast notification displays
- AND dialog closes automatically

### Scenario: Task list refreshes after creation [HAB.tasks.create.refresh]

- WHEN task is created successfully
- THEN all relevant queries are invalidated
- AND task lists update to show new task
- AND counts in sidebar update

---

## Task Completion [HAB.tasks.complete]

Users can toggle task completion status.

### Scenario: Mark task complete [HAB.tasks.complete.mark]

- WHEN user clicks checkbox for incomplete task
- THEN task is marked as complete via API
- AND task gets strikethrough styling
- AND completedAt timestamp is set
- AND task moves to completed filter
- AND success notification displays

### Scenario: Mark task incomplete [HAB.tasks.complete.unmark]

- WHEN user clicks checkbox for completed task
- THEN task is marked as incomplete via API
- AND strikethrough styling is removed
- AND completedAt timestamp is cleared
- AND task returns to appropriate active filter

### Scenario: Update counts after toggle [HAB.tasks.complete.counts]

- WHEN task completion is toggled
- THEN filter counts in sidebar update
- AND task list updates to reflect change

---

## Inline Task Editing [HAB.tasks.edit]

Users can edit task titles directly in the task list.

### Scenario: Start editing task [HAB.tasks.edit.start]

- WHEN user clicks task title
- THEN title becomes editable input field
- AND current title is pre-filled
- AND input is auto-focused
- AND cursor is positioned for editing

### Scenario: Save edited title [HAB.tasks.edit.save]

- WHEN user presses Enter or clicks outside input
- THEN new title is saved via API (if changed)
- AND input closes, returning to display mode
- AND task list updates with new title
- AND if unchanged, no API call is made

### Scenario: Cancel editing [HAB.tasks.edit.cancel]

- WHEN user presses Escape while editing
- THEN editing mode closes without saving
- AND original title is restored

### Scenario: Validate title [HAB.tasks.edit.validate]

- WHEN user tries to save empty or whitespace-only title
- THEN save is prevented
- AND editing mode closes
- AND original title remains

---

## Task Menu Options [HAB.tasks.menu]

Each task has a dropdown menu with additional options.

### Scenario: Show menu on hover [HAB.tasks.menu.hover]

- WHEN user hovers over task
- THEN menu button (three dots) becomes visible
- AND menu button fades in smoothly

### Scenario: Open menu [HAB.tasks.menu.open]

- WHEN user clicks menu button
- THEN dropdown menu opens
- AND displays available actions (Edit, Delete, etc.)

### Scenario: Edit from menu [HAB.tasks.menu.edit]

- WHEN user clicks "Edit" in menu
- THEN task enters inline edit mode
- AND input is focused for editing

### Scenario: Delete task [HAB.tasks.menu.delete]

- WHEN user clicks "Delete" in menu
- THEN task is deleted via API
- AND task is removed from all views
- AND success notification displays
- AND task lists refresh

---

## Task Sidebar Filtering [HAB.tasks.sidebar]

Sidebar provides filter navigation with live counts.

### Scenario: Display filter counts [HAB.tasks.sidebar.counts]

- WHEN user views tasks page
- THEN sidebar shows count for each filter
- AND counts are calculated from all task data
- AND counts update when tasks change

### Scenario: Active filter highlighting [HAB.tasks.sidebar.active]

- WHEN user selects a filter
- THEN selected filter is visually highlighted
- AND main content updates to show filtered tasks

### Scenario: Category filters [HAB.tasks.sidebar.categories]

- WHEN sidebar displays
- THEN shows 5 category filters (work, personal, health, learning, other)
- AND each shows count of tasks in that category

---

## Task Display Details [HAB.tasks.details]

Task items display contextual information.

### Scenario: Show time for non-all-day tasks [HAB.tasks.details.time]

- WHEN task is not marked as all-day
- THEN displays clock icon and start time
- AND time is formatted as 12-hour with AM/PM

### Scenario: Hide time for all-day tasks [HAB.tasks.details.all-day]

- WHEN task is marked as all-day
- THEN time display is hidden
- AND only title is shown

### Scenario: Show date in non-today views [HAB.tasks.details.date]

- WHEN viewing tasks in week/overdue/completed filters
- THEN each task shows date alongside title
- AND date format includes weekday, month, day

### Scenario: Show time in today view [HAB.tasks.details.today-time]

- WHEN viewing today's tasks
- THEN tasks show time but not date
- AND all-day tasks show no time

---

## Responsive Behavior [HAB.tasks.responsive]

Task interface adapts to different screen sizes.

### Scenario: Desktop layout [HAB.tasks.responsive.desktop]

- WHEN user views on desktop
- THEN sidebar is visible alongside main content
- AND layout uses flex container
- AND both areas are scrollable independently

### Scenario: Mobile layout [HAB.tasks.responsive.mobile]

- WHEN user views on mobile
- THEN sidebar collapses or adapts
- AND main content takes full width
- AND filtering remains accessible

---

## Error Handling [HAB.tasks.errors]

Task operations handle errors gracefully.

### Scenario: Creation error [HAB.tasks.errors.create]

- WHEN task creation fails
- THEN error toast notification displays
- AND dialog remains open for retry
- AND user's input is preserved

### Scenario: Update error [HAB.tasks.errors.update]

- WHEN task update fails
- THEN error toast notification displays
- AND editing mode closes
- AND original value is restored

### Scenario: Delete error [HAB.tasks.errors.delete]

- WHEN task deletion fails
- THEN error toast notification displays
- AND task remains in list
- AND user can retry operation

### Scenario: Toggle error [HAB.tasks.errors.toggle]

- WHEN completion toggle fails
- THEN error toast notification displays
- AND checkbox reverts to original state
- AND user can retry
