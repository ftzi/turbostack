# Navigation & Sidebar [HAB.nav]

Dashboard sidebar navigation and user menu.

## Entry Points

Navigation is present on all authenticated dashboard pages.

## UI

Sidebar structure:
- **Header** - "Habbits" logo/brand (64px height)
- **Navigation menu** - 16 navigation links with icons
- **User section** - User profile dropdown at bottom

### Navigation Links

All navigation links point to valid routes:

| Link | Route | Icon | Feature Spec |
|------|-------|------|--------------|
| Dashboard | `/dashboard` | Home | [HAB.dashboard] |
| Tasks | `/tasks` | CheckSquare | [HAB.tasks] |
| Calendar | `/calendar` | Calendar | [HAB.calendar] |
| Goals | `/goals` | Target | [HAB.goals] |
| Physical | `/physical` | Activity | [HAB.wellness.physical] |
| Nutrition | `/nutrition` | Apple | [HAB.wellness.nutrition] |
| Health | `/health` | Stethoscope | [HAB.wellness.health] |
| Sleep | `/sleep` | Moon | [HAB.wellness.sleep] |
| Mind | `/mind` | Zap | [HAB.wellness.mind] |
| Personal Care | `/personal-care` | Scissors | [HAB.wellness.personal-care] |
| Social | `/social` | Users | [HAB.wellness.social] |
| Mindset | `/mindset` | Brain | [HAB.wellness.mindset] |
| Self-Esteem | `/self-esteem` | Heart | [HAB.wellness.self-esteem] |
| Pets | `/pets` | PawPrint | [HAB.wellness.pets] |
| Groceries | `/groceries` | ShoppingCart | [HAB.wellness.groceries] |
| Purchases | `/purchases` | CreditCard | [HAB.wellness.purchases] |

### User Dropdown

User dropdown menu actions:

| Action | Route/Function | Description |
|--------|----------------|-------------|
| Settings | `/settings` | Opens settings page [HAB.settings] |
| Theme Toggle | (inline) | Switches light/dark theme |
| Sign out | `authClient.signOut()` | Logs out user, redirects to home |

---

## Sidebar Display [HAB.nav.sidebar]

Sidebar is fixed on left side of dashboard layout.

### Scenario: Display sidebar [HAB.nav.sidebar.display]

- WHEN user is on any authenticated dashboard page
- THEN sidebar is visible on left side
- AND sidebar is 256px wide (w-64)
- AND sidebar has white background (dark mode: gray-900)
- AND sidebar spans full viewport height

### Scenario: Brand/logo [HAB.nav.sidebar.brand]

- WHEN sidebar displays
- THEN "Habbits" text appears in header
- AND header is 64px tall
- AND header has bottom border

### Scenario: Scrollable navigation [HAB.nav.sidebar.scroll]

- WHEN navigation items exceed viewport height
- THEN navigation area is scrollable
- AND header and user section remain fixed

---

## Navigation Links [HAB.nav.links]

Navigation links provide access to all features.

### Scenario: Display all navigation links [HAB.nav.links.display]

- WHEN sidebar renders
- THEN displays all 16 navigation links
- AND each link shows icon and label
- AND links are in consistent order

### Scenario: Navigate to feature [HAB.nav.links.navigate]

- WHEN user clicks navigation link
- THEN navigates to specified route
- AND new page loads
- AND sidebar remains visible

### Scenario: Active link highlighting [HAB.nav.links.active]

- WHEN user is on a route matching navigation link
- THEN that link is visually highlighted
- AND uses blue background and text
- AND shows blue right border indicator

### Scenario: Hover state [HAB.nav.links.hover]

- WHEN user hovers over non-active link
- THEN link background changes to gray
- AND text color darkens slightly
- AND transition is smooth

### Scenario: Icon colors [HAB.nav.links.icons]

- WHEN link is active
- THEN icon is blue
- WHEN link is inactive
- THEN icon is gray
- WHEN link is hovered
- THEN icon color transitions

---

## Score Indicators [HAB.nav.scores]

Navigation links show progress/score indicators.

### Scenario: Perfect score indicator [HAB.nav.scores.perfect]

- WHEN page has "perfect" score
- THEN displays gold Crown icon next to link
- AND icon appears on right side

### Scenario: Good score indicator [HAB.nav.scores.good]

- WHEN page has "good" score
- THEN displays green dot next to link
- AND dot is small (8px diameter)

### Scenario: No score indicator [HAB.nav.scores.none]

- WHEN page has no score
- THEN no indicator is shown
- AND link displays normally

### Scenario: Score calculation [HAB.nav.scores.calculate]

- WHEN sidebar renders
- THEN scores are calculated via `getPageScore()`
- AND currently uses mock scoring logic
- AND in future will use API/database data

---

## User Section [HAB.nav.user]

User profile and account actions at bottom of sidebar.

### Scenario: Display user info [HAB.nav.user.display]

- WHEN user is authenticated
- THEN user section displays at bottom of sidebar
- AND shows user avatar (initials or icon)
- AND shows user name from session
- AND shows "Privacy-first coaching" subtitle

### Scenario: Anonymous user [HAB.nav.user.anonymous]

- WHEN user name is not available
- THEN displays "Anonymous User" as fallback
- AND still shows user section

### Scenario: User avatar [HAB.nav.user.avatar]

- WHEN user section displays
- THEN shows circular avatar with blue background
- AND displays User icon inside
- AND avatar is 32px (h-8 w-8)

### Scenario: Hover state [HAB.nav.user.hover]

- WHEN user hovers over user section
- THEN background changes to gray
- AND cursor shows it's clickable

---

## User Dropdown Menu [HAB.nav.menu]

Dropdown menu with user actions.

### Scenario: Open dropdown [HAB.nav.menu.open]

- WHEN user clicks user section
- THEN dropdown menu opens above user section
- AND menu is 224px wide (w-56)
- AND menu is centered relative to sidebar

### Scenario: Settings option [HAB.nav.menu.settings]

- WHEN user clicks "Settings" in menu
- THEN navigates to `/settings`
- AND settings page loads [HAB.settings]
- AND menu closes

### Scenario: Theme toggle [HAB.nav.menu.theme]

- WHEN user clicks theme toggle in menu
- THEN theme switches between light and dark
- AND entire application updates theme
- AND preference is persisted
- AND menu remains open

### Scenario: Sign out [HAB.nav.menu.signout]

- WHEN user clicks "Sign out"
- THEN `authClient.signOut()` is called
- AND user is logged out
- AND user is redirected to home page `/`
- AND session is cleared

### Scenario: Sign out styling [HAB.nav.menu.signout-style]

- WHEN dropdown displays
- THEN "Sign out" option is styled in red
- AND separated from other options with divider
- AND warning color indicates destructive action

---

## Responsive Behavior [HAB.nav.responsive]

Sidebar adapts to different screen sizes.

### Scenario: Desktop sidebar [HAB.nav.responsive.desktop]

- WHEN viewing on desktop (>= 1024px)
- THEN sidebar is fixed and always visible
- AND takes up 256px width
- AND main content adjusts accordingly

### Scenario: Mobile sidebar [HAB.nav.responsive.mobile]

- WHEN viewing on mobile (< 1024px)
- THEN sidebar collapses or becomes overlay
- AND hamburger menu button appears
- AND sidebar can be toggled open/closed

---

## Theme Support [HAB.nav.theme]

Sidebar respects theme settings.

### Scenario: Light theme [HAB.nav.theme.light]

- WHEN light theme is active
- THEN sidebar has white background
- AND borders are light gray
- AND text is dark

### Scenario: Dark theme [HAB.nav.theme.dark]

- WHEN dark theme is active
- THEN sidebar has gray-900 background
- AND borders are dark gray
- AND text is light
- AND contrast meets accessibility standards

---

## Accessibility [HAB.nav.a11y]

Sidebar is keyboard-accessible and screen-reader friendly.

### Scenario: Keyboard navigation [HAB.nav.a11y.keyboard]

- WHEN user navigates with keyboard
- THEN can tab through all navigation links
- AND can activate links with Enter key
- AND focus indicators are visible

### Scenario: Screen reader [HAB.nav.a11y.screen-reader]

- WHEN using screen reader
- THEN navigation is properly announced
- AND link labels are descriptive
- AND current page is indicated

---

## Route Validation [HAB.nav.validation]

All navigation links point to valid routes.

### Scenario: All routes exist [HAB.nav.validation.routes]

- WHEN sidebar navigation is defined
- THEN all href values point to existing routes
- AND no links point to non-existent pages
- AND all routes have corresponding page components

**Valid Routes:**
- ✅ `/dashboard` → `app/(dashboard)/dashboard/page.tsx`
- ✅ `/tasks` → `app/(dashboard)/tasks/page.tsx`
- ✅ `/calendar` → `app/(dashboard)/calendar/page.tsx`
- ✅ `/goals` → `app/(dashboard)/goals/page.tsx`
- ✅ `/physical` → `app/(dashboard)/physical/page.tsx`
- ✅ `/nutrition` → `app/(dashboard)/nutrition/page.tsx`
- ✅ `/health` → `app/(dashboard)/health/page.tsx`
- ✅ `/sleep` → `app/(dashboard)/sleep/page.tsx`
- ✅ `/mind` → `app/(dashboard)/mind/page.tsx`
- ✅ `/personal-care` → `app/(dashboard)/personal-care/page.tsx`
- ✅ `/social` → `app/(dashboard)/social/page.tsx`
- ✅ `/mindset` → `app/(dashboard)/mindset/page.tsx`
- ✅ `/self-esteem` → `app/(dashboard)/self-esteem/page.tsx`
- ✅ `/pets` → `app/(dashboard)/pets/page.tsx`
- ✅ `/groceries` → `app/(dashboard)/groceries/page.tsx`
- ✅ `/purchases` → `app/(dashboard)/purchases/page.tsx`
- ✅ `/settings` → `app/(dashboard)/settings/page.tsx`

### Scenario: Feature specs exist [HAB.nav.validation.specs]

- WHEN navigation link is defined
- THEN corresponding feature spec exists
- AND spec ID is referenced in navigation table
- AND spec documents the feature
