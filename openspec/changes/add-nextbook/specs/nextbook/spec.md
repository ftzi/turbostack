## ADDED Requirements

### Requirement: Story Definition API

The system SHALL provide a `story()` function that wraps story components with optional configuration.

#### Scenario: Simple story without controls
- **WHEN** a developer exports `story({ render: () => <Component /> })`
- **THEN** the story renders the component without a controls panel

#### Scenario: Story with Zod schema
- **WHEN** a developer exports `story({ schema: z.object({...}), render: (props) => <Component {...props} /> })`
- **THEN** the story renders with an auto-generated controls panel
- **AND** the `props` parameter is fully typed from the schema

#### Scenario: Schema with defaults and descriptions
- **WHEN** the schema uses `.default()` and `.describe()` on fields
- **THEN** the controls panel shows the default values initially
- **AND** the controls panel shows the descriptions as labels

### Requirement: Zod to Controls Mapping

The system SHALL auto-generate form controls from Zod schema types.

#### Scenario: String field
- **WHEN** a schema field is `z.string()`
- **THEN** the control is a text input

#### Scenario: Number field
- **WHEN** a schema field is `z.number()`
- **THEN** the control is a number input

#### Scenario: Boolean field
- **WHEN** a schema field is `z.boolean()`
- **THEN** the control is a toggle/checkbox

#### Scenario: Enum field
- **WHEN** a schema field is `z.enum(['a', 'b', 'c'])`
- **THEN** the control is a select dropdown with options a, b, c

#### Scenario: Default value extraction
- **WHEN** a schema field has `.default(value)`
- **THEN** the control shows `value` as its initial state

#### Scenario: Description extraction
- **WHEN** a schema field has `.describe('Label text')`
- **THEN** the control shows "Label text" as its label

### Requirement: File-Based Story Discovery

The system SHALL discover stories by scanning `.story.tsx` files at build time.

#### Scenario: Single story file
- **WHEN** `app/ui/stories/Button.story.tsx` exists with `export const Primary = story({...})`
- **THEN** the story appears in sidebar as "Button / Primary"
- **AND** the URL `/ui/Button/Primary` renders this story

#### Scenario: Nested directories
- **WHEN** `app/ui/stories/Forms/Input.story.tsx` exists
- **THEN** the sidebar shows "Forms" as a collapsible section containing "Input"
- **AND** the URL `/ui/Forms/Input/VariantName` renders the story

#### Scenario: Multiple exports per file
- **WHEN** a story file exports `Primary`, `Secondary`, `Disabled`
- **THEN** all three appear as variants under the same story in the sidebar

#### Scenario: Kebab-case filenames
- **WHEN** a file is named `text-input.story.tsx`
- **THEN** it displays as "Text-input" in the sidebar (first char uppercased)

### Requirement: Path-Based Naming Convention

The system SHALL derive story names from file paths without requiring explicit titles.

#### Scenario: Directory becomes section
- **WHEN** stories are in `Forms/Input.story.tsx` and `Forms/Select.story.tsx`
- **THEN** the sidebar groups both under a "Forms" section

#### Scenario: Export becomes variant
- **WHEN** a file exports `WithLabel` and `WithError`
- **THEN** both appear as selectable variants under that story

#### Scenario: First character capitalization
- **WHEN** a file or export starts with lowercase
- **THEN** it displays with the first character uppercased

### Requirement: URL Routing

The system SHALL use path-based URLs that mirror the story hierarchy.

#### Scenario: Story variant URL
- **WHEN** user navigates to `/ui/Forms/Input/Primary`
- **THEN** the "Forms / Input / Primary" story renders in the viewer

#### Scenario: Index URL
- **WHEN** user navigates to `/ui`
- **THEN** the Nextbook index page renders with sidebar and welcome content

#### Scenario: Invalid path
- **WHEN** user navigates to `/ui/NonExistent/Story`
- **THEN** a 404 page renders

### Requirement: Shell Component

The system SHALL provide a `NextbookShell` component for the story viewer layout.

#### Scenario: Sidebar and content layout
- **WHEN** `NextbookShell` wraps the page content
- **THEN** a sidebar with story navigation renders on the left
- **AND** the story viewer renders in the main content area

#### Scenario: Active story indication
- **WHEN** a story is selected
- **THEN** the sidebar highlights the active story

### Requirement: Page Component

The system SHALL provide a `NextbookPage` component and `generateNextbookParams` function.

#### Scenario: Page setup
- **WHEN** developer uses `export default NextbookPage` and `export { generateNextbookParams as generateStaticParams }`
- **THEN** all discovered stories are statically generated
- **AND** each story URL renders correctly

### Requirement: Controls Panel

The system SHALL render an interactive controls panel for stories with Zod schemas.

#### Scenario: Live prop updates
- **WHEN** user changes a control value
- **THEN** the story re-renders immediately with the new prop value

#### Scenario: No schema
- **WHEN** a story has no schema
- **THEN** no controls panel renders

#### Scenario: Reset to defaults
- **WHEN** user clicks a reset button (if provided)
- **THEN** all controls return to their default values from the schema
