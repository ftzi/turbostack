# Calendar [HAB.calendar]

Full calendar view for visualizing and managing events across time.

## Entry Points

| Route | Description |
|-------|-------------|
| `/calendar` | Calendar interface |

## UI

Calendar page displays:
- **Add Event button** - Top-right action button
- **Calendar grid** - react-big-calendar component with month/week/day/agenda views
- **Create dialog** - Opened by clicking date slot or Add Event button

Uses `react-big-calendar` library with moment.js localizer.

---

## Calendar Display [HAB.calendar.display]

Calendar shows user's events in visual grid format.

### Scenario: Display month view [HAB.calendar.display.month]

- WHEN user views calendar
- THEN displays month grid by default
- AND shows all events within visible month
- AND events from 2 months prior to 2 months ahead are loaded

### Scenario: Switch to week view [HAB.calendar.display.week]

- WHEN user selects week view
- THEN displays current week in columnar format
- AND shows time slots with events

### Scenario: Switch to day view [HAB.calendar.display.day]

- WHEN user selects day view
- THEN displays single day with time slots
- AND events shown in chronological order

### Scenario: Switch to agenda view [HAB.calendar.display.agenda]

- WHEN user selects agenda view
- THEN displays list of upcoming events
- AND events grouped by date

---

## Event Creation [HAB.calendar.create]

Users can create events by clicking calendar slots or Add Event button.

### Scenario: Create event from Add Event button [HAB.calendar.create.button]

- WHEN user clicks "Add Event" button
- THEN create dialog opens
- AND dialog is empty with current date pre-selected

### Scenario: Create event from calendar slot [HAB.calendar.create.slot]

- WHEN user clicks empty time slot on calendar
- THEN create dialog opens
- AND selected date/time is pre-filled in form
- AND user can adjust details before saving

### Scenario: Event appears after creation [HAB.calendar.create.refresh]

- WHEN event is created successfully
- THEN calendar refreshes
- AND new event appears in calendar grid
- AND dialog closes automatically

---

## Event Selection [HAB.calendar.select]

Users can click events to view details or edit.

### Scenario: Click event [HAB.calendar.select.click]

- WHEN user clicks event on calendar
- THEN event details are logged (placeholder for future edit dialog)
- AND event is highlighted

---

## Date Range Loading [HAB.calendar.range]

Calendar loads events for visible date range.

### Scenario: Load events for view [HAB.calendar.range.load]

- WHEN calendar initializes
- THEN loads events from 2 months before to 2 months after
- AND range is memoized to prevent unnecessary refetches

### Scenario: Navigate to different month [HAB.calendar.range.navigate]

- WHEN user navigates to different time period
- THEN events for new range are displayed
- AND out-of-range events are not shown

---

## Multi-Day Events [HAB.calendar.multiday]

Calendar supports events spanning multiple days.

### Scenario: Display multi-day event [HAB.calendar.multiday.display]

- WHEN event spans multiple days
- THEN event bar extends across date cells
- AND showMultiDayTimes configuration displays times

---

## Responsive Design [HAB.calendar.responsive]

Calendar adapts to screen size.

### Scenario: Mobile calendar [HAB.calendar.responsive.mobile]

- WHEN viewed on mobile
- THEN calendar remains functional
- AND touch interactions work for selection
- AND views adapt to smaller screen

### Scenario: Desktop calendar [HAB.calendar.responsive.desktop]

- WHEN viewed on desktop
- THEN full calendar grid displays
- AND all views are accessible
- AND events are clearly visible

---

## Theme Support [HAB.calendar.theme]

Calendar respects theme settings.

### Scenario: Light theme [HAB.calendar.theme.light]

- WHEN light theme is active
- THEN calendar uses light background
- AND events have light theme styling

### Scenario: Dark theme [HAB.calendar.theme.dark]

- WHEN dark theme is active
- THEN calendar uses dark background
- AND events have dark theme styling
- AND text remains readable
