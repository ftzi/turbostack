# Nextbook

**Zero-config component stories for Next.js**

Nextbook is a lightweight alternative to Storybook, designed specifically for Next.js. It uses your app's existing configuration - no separate build process, no Tailwind duplication, no webpack config.

## Features

- **Zero Config** - Uses your Next.js app's existing setup
- **Path-Based Hierarchy** - File path becomes sidebar structure automatically
- **Zod Controls** - Auto-generate interactive controls from Zod schemas
- **Type Safe** - Full TypeScript support with IntelliSense

## Quick Start

### 1. Register your stories

```tsx
// app/ui/stories/index.ts
import { createStoryRegistry } from "@workspace/nextbook"

export const { storyTree, StoryPage } = await createStoryRegistry({
  "button.story": () => import("./button.story"),
  "forms/input.story": () => import("./forms/input.story"),
})
```

The key becomes the sidebar path: `"forms/input.story"` → `Forms / Input`

### 2. Create the layout

```tsx
// app/ui/layout.tsx
import "@workspace/ui/globals.css"
import { NextbookShell } from "@workspace/nextbook"
import { storyTree } from "./stories"

export default function NextbookLayout({ children }: { children: React.ReactNode }) {
  return <NextbookShell tree={storyTree}>{children}</NextbookShell>
}
```

### 3. Create the page

```tsx
// app/ui/[[...path]]/page.tsx
import { StoryPage, storyTree } from "../stories"

export default async function Page({ params }: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await params

  if (path.length === 0) {
    return <div>Welcome to Nextbook. Select a story from the sidebar.</div>
  }

  return <StoryPage path={path} />
}
```

### 4. Write stories

```tsx
// app/ui/stories/button.story.tsx
import { story } from "@workspace/nextbook"
import { Button } from "@workspace/ui/components/button"

export const Default = story({
  render: () => <Button>Click me</Button>,
})

export const Secondary = story({
  render: () => <Button variant="secondary">Secondary</Button>,
})
```

## Story API

### Simple Story

```tsx
export const Default = story({
  render: () => <MyComponent />,
})
```

### Story with Zod Controls

Use Zod schemas to auto-generate interactive controls:

```tsx
import { z } from "zod"

export const Interactive = story({
  schema: z.object({
    variant: z.enum(["primary", "secondary"])
      .default("primary")
      .describe("Button variant"),
    disabled: z.boolean()
      .default(false)
      .describe("Disabled state"),
    children: z.string()
      .default("Click me")
      .describe("Button text"),
  }),
  render: (props) => <Button {...props} />,
})
```

### Zod → Control Mapping

| Zod Type | Control |
|----------|---------|
| `z.string()` | Text input |
| `z.number()` | Number input |
| `z.boolean()` | Toggle |
| `z.enum([...])` | Select dropdown |

- `.default(value)` - Sets initial control value
- `.describe("Label")` - Sets control label

## File Organization

Stories are organized by the keys you provide to `createStoryRegistry`:

```tsx
export const { storyTree, StoryPage } = await createStoryRegistry({
  "button.story": () => import("./button.story"),           // → "Button"
  "forms/input.story": () => import("./forms/input.story"), // → "Forms / Input"
  "forms/select.story": () => import("./forms/select.story"), // → "Forms / Select"
  "layout/card.story": () => import("./layout/card.story"),   // → "Layout / Card"
})
```

Named exports become story variants:

```tsx
// button.story.tsx
export const Primary = story({ ... })   // → "Button / Primary"
export const Secondary = story({ ... }) // → "Button / Secondary"
```

## Layout Isolation

Nextbook needs its own `<html>` and `<body>` to avoid inheriting your app's providers. `NextbookShell` handles this automatically.

If your root layout has providers that conflict, use `useSelectedLayoutSegment` to skip them:

```tsx
// components/root-layout-wrapper.tsx
"use client"
import { useSelectedLayoutSegment } from "next/navigation"
import { Providers } from "./providers"

export function RootLayoutWrapper({ children, fontClasses }) {
  const segment = useSelectedLayoutSegment()

  // Skip for Nextbook - it provides its own html/body
  if (segment === "ui") {
    return <>{children}</>
  }

  return (
    <html lang="en">
      <body className={fontClasses}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

Reference: [useSelectedLayoutSegment](https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segment)

## URL Structure

- `/ui` - Index page
- `/ui/button/primary` - Button / Primary story
- `/ui/forms/input/interactive` - Forms / Input / Interactive story

## Access Control

Block in production if needed:

```tsx
// app/ui/layout.tsx
import { notFound } from "next/navigation"

export default function NextbookLayout({ children }) {
  if (process.env.NODE_ENV === "production") {
    notFound()
  }
  return <NextbookShell tree={storyTree}>{children}</NextbookShell>
}
```

## Why Nextbook?

| Feature | Storybook | Nextbook |
|---------|-----------|----------|
| Setup time | ~30 min | ~5 min |
| Separate build | Yes | No |
| Config duplication | Yes (Tailwind, etc.) | No |
| Bundle size | Large | Minimal |
| Hot reload | Separate process | Same as app |

## License

MIT
