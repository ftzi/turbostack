# Change: Add Nextbook - Zero-Config Storybook Alternative for Next.js

## Why

Storybook requires complex setup: separate build process, Tailwind config duplication, CSS imports, webpack configuration. For Next.js projects, this friction is unnecessary - the app already has everything configured.

Nextbook eliminates this by using Next.js's own routing and build system. Stories are just React components in `.story.tsx` files, rendered through normal Next.js pages. Zero config, instant setup.

## What Changes

- **New package:** `packages/nextbook/` - standalone package (future npm publish)
- **Story API:** `story()` function with optional Zod schema for auto-generated controls
- **File discovery:** Build-time scanning of `.story.tsx` files via `generateStaticParams`
- **Sidebar navigation:** Auto-generated from file/folder structure
- **Controls panel:** Auto-generated from Zod schema (string, number, boolean, enum)
- **Path-based naming:** File path becomes hierarchy, named exports become variants

## Key Features

### Zero Config
```tsx
// app/ui/stories/Button.story.tsx
import { story } from 'nextbook'
import { Button } from '@workspace/ui/components/Button'

export const Primary = story({
  render: () => <Button>Click me</Button>,
})
```

### Auto-Generated Controls via Zod
```tsx
export const Interactive = story({
  schema: z.object({
    variant: z.enum(['primary', 'secondary']).default('primary').describe('Button style'),
    disabled: z.boolean().default(false).describe('Disabled state'),
  }),
  render: (props) => <Button {...props}>Click me</Button>,
})
```

### File-Based Hierarchy
```
app/ui/stories/
├── Button.story.tsx          → "Button"
├── Forms/
│   ├── Input.story.tsx       → "Forms / Input"
│   └── Select.story.tsx      → "Forms / Select"
```

### Path-Based URLs
- `/ui` → Story index
- `/ui/Forms/Input/Primary` → Specific variant

## Impact

- **New package:** `packages/nextbook/`
- **No changes to existing code** - Nextbook is additive
- **Future:** Can be extracted as standalone npm package

## Non-Goals (v1)

- Dark/light theme toggle (requires provider complexity)
- Search/filter stories
- Viewport size presets
- Source code view
- MDX documentation support
- Addon/plugin system
