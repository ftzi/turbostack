# site-layout Specification

## Purpose
TBD - created by archiving change add-template-ui. Update Purpose after archive.
## Requirements
### Requirement: Responsive Design

All UI components SHALL be responsive and work correctly on mobile (375px+), tablet (768px+), and desktop (1280px+) viewports.

#### Scenario: Mobile viewport renders correctly
- **WHEN** a page is viewed on a 375px viewport
- **THEN** all content is readable without horizontal scrolling
- **AND** touch targets are at least 44x44px

#### Scenario: Desktop viewport uses available space
- **WHEN** a page is viewed on a 1280px+ viewport
- **THEN** content is constrained to a readable max-width
- **AND** layout takes advantage of horizontal space where appropriate

### Requirement: Theme Support

All UI components SHALL support light and dark themes using the existing CSS variable system.

#### Scenario: Light theme rendering
- **WHEN** the theme is set to light
- **THEN** all components use light theme colors from CSS variables
- **AND** text has sufficient contrast (WCAG AA)

#### Scenario: Dark theme rendering
- **WHEN** the theme is set to dark
- **THEN** all components use dark theme colors from CSS variables
- **AND** text has sufficient contrast (WCAG AA)

### Requirement: Header Component

The system SHALL provide a Header component with navigation, logo, theme toggle, and configurable sticky behavior.

#### Scenario: Header displays navigation
- **WHEN** the Header component is rendered
- **THEN** it displays the site logo linked to home
- **AND** it displays navigation links
- **AND** it includes a theme toggle button
- **AND** it provides a slot for auth-related buttons

#### Scenario: Sticky header behavior
- **WHEN** `STICKY_HEADER` constant is true
- **THEN** the header remains fixed at the top during scroll
- **AND** content below has appropriate top margin

#### Scenario: Non-sticky header behavior
- **WHEN** `STICKY_HEADER` constant is false
- **THEN** the header scrolls with the page content

### Requirement: Mobile Navigation

The system SHALL provide a mobile navigation drawer that appears on small viewports.

#### Scenario: Hamburger menu on mobile
- **WHEN** viewport width is below the tablet breakpoint
- **THEN** desktop navigation links are hidden
- **AND** a hamburger menu button is displayed

#### Scenario: Mobile drawer opens
- **WHEN** user taps the hamburger menu button
- **THEN** a slide-out drawer appears with navigation links
- **AND** the drawer can be closed by tapping outside or pressing escape

### Requirement: Footer Component

The system SHALL provide a Footer component with logo, navigation links, social links, and copyright.

#### Scenario: Footer displays all sections
- **WHEN** the Footer component is rendered
- **THEN** it displays the site logo
- **AND** it displays organized navigation link columns
- **AND** it displays social media icon links
- **AND** it displays copyright text with current year

#### Scenario: Footer links to legal pages
- **WHEN** the Footer is rendered
- **THEN** it includes links to Privacy Policy and Terms of Service pages

### Requirement: Container Component

The system SHALL provide a Container component for consistent content width and padding.

#### Scenario: Container constrains content width
- **WHEN** the Container component wraps content
- **THEN** content has a maximum width appropriate for readability
- **AND** content has consistent horizontal padding on all viewports

### Requirement: Section Component

The system SHALL provide a Section component for consistent vertical spacing in landing pages.

#### Scenario: Section provides consistent spacing
- **WHEN** the Section component wraps content
- **THEN** it applies consistent vertical padding
- **AND** it optionally accepts a background color variant

