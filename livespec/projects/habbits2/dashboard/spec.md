# Dashboard Overview [HAB.dashboard]

Main authenticated dashboard providing overview of user's self-improvement journey.

## Entry Points

| Route | Description |
|-------|-------------|
| `/dashboard` | Main dashboard after login |

## UI

Dashboard displays:
- **Quick Stats Grid** - 4 stat cards (Tasks Today, Goals Active, Health Score, Mood)
- **Today's Focus** - Card showing current focus items
- **AI Coach Insights** - Card with AI-generated coaching suggestions

### Design Requirements

- **Authenticated only** - Requires user to be logged in
- **Mobile-responsive** - Grid adapts from 1 column (mobile) to 4 columns (desktop)
- **Real-time data** - Stats update based on user's actual data
- **Theme support** - Works in light and dark mode

---

## Quick Stats [HAB.dashboard.stats]

Dashboard displays overview statistics for user's activities.

### Scenario: Display stat cards [HAB.dashboard.stats.display]

- WHEN authenticated user views dashboard
- THEN 4 stat cards are displayed
- AND "Tasks Today" card shows count with CheckSquare icon
- AND "Goals Active" card shows count with Target icon
- AND "Health Score" card shows score or "--" with Activity icon
- AND "Mood" card shows mood or "--" with Brain icon

### Scenario: Tasks today count [HAB.dashboard.stats.tasks]

- WHEN user has tasks scheduled for today
- THEN "Tasks Today" card displays correct count
- AND count updates when tasks are added or completed

### Scenario: Active goals count [HAB.dashboard.stats.goals]

- WHEN user has active goals
- THEN "Goals Active" card displays correct count
- AND count updates when goals are created or deleted

### Scenario: Placeholder for unimplemented metrics [HAB.dashboard.stats.placeholder]

- WHEN metric is not yet implemented
- THEN card displays "--" as placeholder
- AND card remains visible in grid

---

## Today's Focus [HAB.dashboard.focus]

Card displaying user's priority items for the day.

### Scenario: Empty focus state [HAB.dashboard.focus.empty]

- WHEN user has no focus items set
- THEN displays empty state message
- AND message suggests adding tasks or goals
- AND card remains visible

### Scenario: Display focus items [HAB.dashboard.focus.display]

- WHEN user has focus items configured
- THEN focus items are listed in card
- AND items are actionable (clickable/checkable)

---

## AI Coach Insights [HAB.dashboard.coach]

Card showing AI-generated coaching suggestions and insights.

### Scenario: Display coaching insights [HAB.dashboard.coach.display]

- WHEN user views dashboard
- THEN AI coach card displays insights
- AND insights are contextual to user's data
- AND footer indicates AI-powered source

### Scenario: Placeholder insights [HAB.dashboard.coach.placeholder]

- WHEN AI coaching is not yet fully implemented
- THEN displays example/placeholder coaching message
- AND message is encouraging and relevant

---

## Responsive Layout [HAB.dashboard.responsive]

Dashboard adapts to different screen sizes.

### Scenario: Mobile layout (< 768px) [HAB.dashboard.responsive.mobile]

- WHEN user views dashboard on mobile
- THEN stat cards display in single column
- AND content cards display in single column
- AND all content remains accessible

### Scenario: Tablet layout (768px - 1280px) [HAB.dashboard.responsive.tablet]

- WHEN user views dashboard on tablet
- THEN stat cards display in 2-column grid
- AND content cards display in 1 or 2 columns

### Scenario: Desktop layout (>= 1280px) [HAB.dashboard.responsive.desktop]

- WHEN user views dashboard on desktop
- THEN stat cards display in 4-column grid
- AND content cards display in 2-column grid

---

## Authentication [HAB.dashboard.auth]

Dashboard requires authentication and handles auth states.

### Scenario: Redirect unauthenticated users [HAB.dashboard.auth.redirect]

- WHEN unauthenticated user tries to access dashboard
- THEN user is redirected to sign-in page
- AND return URL is preserved for post-login redirect

### Scenario: Display for authenticated users [HAB.dashboard.auth.display]

- WHEN authenticated user accesses dashboard
- THEN dashboard loads with user's data
- AND stats reflect user's actual information
