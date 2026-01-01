# Events & Tasks API [HAB.api.events]

Calendar events and task management with support for recurring events, categories, and completion tracking.

## Entry Points

| Procedure | Description |
|-----------|-------------|
| `events.create` | Create a new event or task |
| `events.getAll` | Get all events with optional filters |
| `events.getFiltered` | Get events by predefined filters (today, week, month, etc.) |
| `events.getById` | Get single event by ID |
| `events.getByDateRange` | Get events within a date range |
| `events.getToday` | Get today's events |
| `events.getRange` | Get events in date range |
| `events.getCompleted` | Get completed events |
| `events.getOverdue` | Get overdue events |
| `events.getOverview` | Get dashboard statistics |
| `events.update` | Update an existing event |
| `events.delete` | Delete an event |
| `events.toggleComplete` | Toggle event completion status |

## UI

Events support multiple views:
- Calendar view with day/week/month navigation
- List view with filtering and search
- Task view focused on completion tracking

## Design Decisions

### Event Categories

**Choice:** Enum of 5 categories: work, personal, health, learning, other

**Rationale:** Provides balance between organization and simplicity. Categories help users organize events without overwhelming them with options.

### Recurring Events

**Choice:** JSON-based recurrence rules with frequency, interval, endDate, count

**Rationale:** Flexible recurrence system that supports:
- Daily, weekly, monthly, yearly frequencies
- Custom intervals (e.g., every 2 days)
- End conditions (end date or occurrence count)
- Stored as JSON for extensibility

### All-Day Events

**Choice:** Boolean flag to mark events that span entire days

**Rationale:** Simplifies time handling for events like holidays, birthdays, or multi-day trips.

---

## Create Event [HAB.api.events.create]

Creates a new calendar event or task for the authenticated user.

### Scenario: Create basic event [HAB.api.events.create.basic]

- WHEN user creates event with title, start time, and end time
- THEN event is created with user as owner
- AND event has unique UUID
- AND timestamps (createdAt, updatedAt) are set to current time
- AND event is not completed by default

### Scenario: Create all-day event [HAB.api.events.create.all-day]

- WHEN user creates event with allDay flag set to true
- THEN event is created spanning entire day(s)
- AND allDay property is true

### Scenario: Create categorized event [HAB.api.events.create.category]

- WHEN user creates event with category (work, personal, health, learning, or other)
- THEN event is created with specified category
- AND category can be used for filtering

### Scenario: Create recurring event [HAB.api.events.create.recurring]

- WHEN user creates event with isRecurring true and recurrence rule
- THEN event is created with recurrence pattern
- AND recurrence rule includes frequency (daily/weekly/monthly/yearly)
- AND may include interval, endDate, or count

### Scenario: Validate end time after start time [HAB.api.events.create.validate-time]

- WHEN user tries to create event with end time before start time
- THEN validation error is thrown
- AND event is not created

### Scenario: Require title [HAB.api.events.create.require-title]

- WHEN user tries to create event without title
- THEN validation error is thrown
- AND event is not created

---

## Get All Events [HAB.api.events.get-all]

Retrieves events for the authenticated user with optional pagination and filtering.

### Scenario: Get all user events [HAB.api.events.get-all.basic]

- WHEN user requests all events
- THEN returns events owned by authenticated user only
- AND events are ordered by start time
- AND pagination defaults to limit 50, offset 0

### Scenario: Filter by date range [HAB.api.events.get-all.date-range]

- WHEN user requests events with startDate and endDate
- THEN returns only events within specified range
- AND includes events that start or end within range

### Scenario: Filter by category [HAB.api.events.get-all.category]

- WHEN user requests events with category filter
- THEN returns only events matching specified category
- AND excludes events with different categories

### Scenario: Paginate results [HAB.api.events.get-all.pagination]

- WHEN user requests events with limit and offset
- THEN returns up to limit number of events
- AND skips first offset events
- AND limit is clamped between 1 and 100

---

## Get Filtered Events [HAB.api.events.get-filtered]

Retrieves events using predefined filter presets for common views.

### Scenario: Get all events filter [HAB.api.events.get-filtered.all]

- WHEN user requests events with filter "all"
- THEN returns all user events (default behavior)
- AND includes completed events by default

### Scenario: Get today's events [HAB.api.events.get-filtered.today]

- WHEN user requests events with filter "today"
- THEN returns events that occur today
- AND includes events starting or ending today

### Scenario: Get this week's events [HAB.api.events.get-filtered.week]

- WHEN user requests events with filter "week"
- THEN returns events occurring in current week
- AND week starts on configured day (typically Sunday or Monday)

### Scenario: Get this month's events [HAB.api.events.get-filtered.month]

- WHEN user requests events with filter "month"
- THEN returns events occurring in current month
- AND includes events spanning month boundaries

### Scenario: Get completed events [HAB.api.events.get-filtered.completed]

- WHEN user requests events with filter "completed"
- THEN returns only events with isCompleted true
- AND includes completedAt timestamp

### Scenario: Get overdue events [HAB.api.events.get-filtered.overdue]

- WHEN user requests events with filter "overdue"
- THEN returns incomplete events with end time in the past
- AND excludes completed events

### Scenario: Get upcoming events [HAB.api.events.get-filtered.upcoming]

- WHEN user requests events with filter "upcoming"
- THEN returns incomplete events with start time in the future
- AND ordered by start time ascending

### Scenario: Exclude completed events [HAB.api.events.get-filtered.exclude-completed]

- WHEN user requests events with includeCompleted false
- THEN completed events are excluded from results
- AND only incomplete events are returned

---

## Get Event Overview [HAB.api.events.get-overview]

Retrieves dashboard statistics for event organization.

### Scenario: Get event statistics [HAB.api.events.get-overview.stats]

- WHEN user requests overview
- THEN returns count of today's events
- AND count of this week's events
- AND count of overdue events
- AND count of completed events
- AND count of upcoming events
- AND total task count

### Scenario: Get category breakdown [HAB.api.events.get-overview.categories]

- WHEN user requests overview
- THEN returns category statistics
- AND each category includes id, name, and event count
- AND covers all five categories (work, personal, health, learning, other)

---

## Get Event By ID [HAB.api.events.get-by-id]

Retrieves a single event by its unique identifier.

### Scenario: Get existing event [HAB.api.events.get-by-id.success]

- WHEN user requests event by valid ID
- THEN returns complete event details
- AND event belongs to authenticated user

### Scenario: Get non-existent event [HAB.api.events.get-by-id.not-found]

- WHEN user requests event with non-existent ID
- THEN operation fails with error

### Scenario: Prevent access to other users' events [HAB.api.events.get-by-id.ownership]

- WHEN user requests event owned by different user
- THEN operation fails with error
- AND event details are not revealed

---

## Get Events By Date Range [HAB.api.events.get-by-date-range]

Retrieves events within a specific date range for calendar views.

### Scenario: Get events in range [HAB.api.events.get-by-date-range.basic]

- WHEN user requests events between start and end dates
- THEN returns events that overlap with date range
- AND includes events starting before but ending within range
- AND includes events starting within range

---

## Get Today's Events [HAB.api.events.get-today]

Retrieves all events occurring today.

### Scenario: Get today's events [HAB.api.events.get-today.basic]

- WHEN user requests today's events
- THEN returns events starting or ending today
- AND uses server's current date for "today"
- AND respects user's timezone

---

## Get Events Range [HAB.api.events.get-range]

Alternative endpoint for retrieving events in a date range.

### Scenario: Get events in custom range [HAB.api.events.get-range.basic]

- WHEN user requests events with startDate and endDate
- THEN returns events within specified range
- AND behavior matches getByDateRange

---

## Get Completed Events [HAB.api.events.get-completed]

Retrieves all completed events for the user.

### Scenario: Get completed events [HAB.api.events.get-completed.basic]

- WHEN user requests completed events
- THEN returns only events with isCompleted true
- AND includes completedAt timestamps
- AND ordered by completion time

---

## Get Overdue Events [HAB.api.events.get-overdue]

Retrieves incomplete events that are past their end time.

### Scenario: Get overdue events [HAB.api.events.get-overdue.basic]

- WHEN user requests overdue events
- THEN returns incomplete events with end time before current time
- AND excludes completed events
- AND helps identify missed tasks

---

## Update Event [HAB.api.events.update]

Updates an existing event's properties.

### Scenario: Update event title [HAB.api.events.update.title]

- WHEN user updates event title
- THEN title is changed to new value
- AND updatedAt timestamp is updated
- AND other properties remain unchanged

### Scenario: Update event times [HAB.api.events.update.times]

- WHEN user updates start or end time
- THEN times are updated
- AND validation ensures end time after start time
- AND updatedAt timestamp is updated

### Scenario: Update event category [HAB.api.events.update.category]

- WHEN user updates event category
- THEN category is changed
- AND new category is one of valid enum values

### Scenario: Update recurrence [HAB.api.events.update.recurrence]

- WHEN user updates recurrence rule
- THEN recurrence pattern is updated
- AND can change frequency, interval, endDate, or count

### Scenario: Partial update [HAB.api.events.update.partial]

- WHEN user updates only some fields
- THEN only specified fields are changed
- AND unspecified fields retain original values

### Scenario: Validate time range on update [HAB.api.events.update.validate-time]

- WHEN user updates times with end before start
- THEN validation error is thrown
- AND event is not updated

### Scenario: Prevent updating other users' events [HAB.api.events.update.ownership]

- WHEN user tries to update event owned by different user
- THEN operation fails with error
- AND event is not modified

---

## Delete Event [HAB.api.events.delete]

Permanently removes an event.

### Scenario: Delete existing event [HAB.api.events.delete.success]

- WHEN user deletes event by ID
- THEN event is permanently removed from database
- AND returns success confirmation
- AND event cannot be retrieved afterwards

### Scenario: Prevent deleting other users' events [HAB.api.events.delete.ownership]

- WHEN user tries to delete event owned by different user
- THEN operation fails with error
- AND event is not deleted

---

## Toggle Completion [HAB.api.events.toggle-complete]

Toggles an event's completion status between complete and incomplete.

### Scenario: Mark event as complete [HAB.api.events.toggle-complete.mark-complete]

- WHEN user toggles incomplete event
- THEN isCompleted changes to true
- AND completedAt timestamp is set to current time
- AND returns updated event

### Scenario: Mark event as incomplete [HAB.api.events.toggle-complete.mark-incomplete]

- WHEN user toggles completed event
- THEN isCompleted changes to false
- AND completedAt timestamp is cleared (null)
- AND returns updated event

### Scenario: Toggle updates timestamp [HAB.api.events.toggle-complete.timestamp]

- WHEN user toggles event completion
- THEN updatedAt timestamp is updated
- AND reflects time of toggle operation

### Scenario: Prevent toggling other users' events [HAB.api.events.toggle-complete.ownership]

- WHEN user tries to toggle event owned by different user
- THEN operation fails with error
- AND event completion status is not changed
