# legal-pages Specification

## Purpose
TBD - created by archiving change add-template-ui. Update Purpose after archive.
## Requirements
### Requirement: Privacy Policy Page

The system SHALL provide a Privacy Policy page with placeholder content and generation guidance.

#### Scenario: Privacy page renders
- **WHEN** user navigates to /privacy
- **THEN** a Privacy Policy page is displayed
- **AND** the page has a clear heading
- **AND** the page contains structured placeholder content

#### Scenario: Privacy page includes AI generation prompt
- **WHEN** a developer views the Privacy Policy source code
- **THEN** a prominent comment is visible with an AI prompt template
- **AND** the prompt includes placeholders for app name, description, and jurisdiction

### Requirement: Terms of Service Page

The system SHALL provide a Terms of Service page with placeholder content and generation guidance.

#### Scenario: Terms page renders
- **WHEN** user navigates to /terms
- **THEN** a Terms of Service page is displayed
- **AND** the page has a clear heading
- **AND** the page contains structured placeholder content

#### Scenario: Terms page includes AI generation prompt
- **WHEN** a developer views the Terms of Service source code
- **THEN** a prominent comment is visible with an AI prompt template
- **AND** the prompt includes placeholders for app name, description, and jurisdiction

### Requirement: Legal Page Styling

Legal pages SHALL have consistent, readable styling optimized for long-form content.

#### Scenario: Legal pages are readable
- **WHEN** a legal page is viewed
- **THEN** text has appropriate line height and max-width for readability
- **AND** headings create clear visual hierarchy
- **AND** the page is responsive on all viewports

