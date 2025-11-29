# Nextbook - AI Assistant Instructions

## Critical: README Synchronization

**THE README.md MUST BE KEPT IN SYNC WITH THE CODE AT ALL TIMES.**

When making ANY changes to the nextbook package:
1. Update the code
2. **Immediately update README.md to reflect those changes**
3. Verify code examples in README are copy-paste correct

The README is the primary documentation for users. Outdated examples cause frustration and wasted time. This is non-negotiable.

## Architecture Overview

### Server/Client Boundary

This package has strict server/client component separation due to Next.js RSC constraints:

```
Server Components:
- layout.tsx (user's file) - Renders <html>, <body>, imports client modules
- page.tsx (user's file) - Renders StoryPage with path from params

Client Components ("use client"):
- stories/index.ts - Exports loaders (functions can't cross server→client)
- NextbookShell - Receives loaders, renders Sidebar
- Sidebar - Lazy loads story exports when expanded
- StoryPage - Renders stories with error boundary
- StoryViewer - Renders individual story with controls
```

**Why this matters:** Functions cannot be passed from Server Components to Client Components. The `loaders` object contains functions, so everything that receives it must be a Client Component.

### Lazy Loading Strategy

Stories are loaded on-demand, NOT at initialization:

1. `createStoryRegistry()` - Only parses file paths to build the tree structure. NO modules are loaded.
2. Sidebar expansion - When a story file node is expanded, its exports are loaded to show variants.
3. Story viewing - When navigating to a story, the module is loaded to render it.

This is critical for performance with large codebases.

## Current API

### createStoryRegistry (synchronous, server-safe)

```typescript
// stories/index.ts - MUST have "use client"
"use client"

import { createStoryRegistry } from "@workspace/nextbook"

export const { storyTree, loaders } = createStoryRegistry({
  button: () => import("./button.story"),
  forms: {
    input: () => import("./forms/input.story"),
    select: () => import("./forms/select.story"),
  },
})
```

Accepts nested objects - `{ forms: { input: loader } }` becomes path `forms/input`.

Returns:
- `storyTree` - Tree structure for sidebar navigation
- `loaders` - Flat record of lazy loaders for on-demand module loading

### NextbookShell (client component)

```typescript
<NextbookShell tree={storyTree} loaders={loaders} basePath="/ui">
  {children}
</NextbookShell>
```

Props:
- `tree` - Story tree from createStoryRegistry
- `loaders` - Loaders from createStoryRegistry
- `basePath` - URL base path (default: "/ui")

**Does NOT render html/body** - User's layout must provide these.

### StoryPage (client component)

```typescript
<StoryPage path={path} storyTree={storyTree} loaders={loaders} />
```

Handles:
- Welcome page when path is empty
- Story lookup and lazy loading
- Error boundary for crashed stories

## File Structure

```
packages/nextbook/src/
├── cli/                    # CLI tool (bunx nextbook)
│   ├── index.ts           # CLI entry point (citty)
│   ├── init.ts            # Init logic
│   ├── init.test.ts       # CLI tests
│   └── templates.ts       # File templates (KEEP IN SYNC with actual API!)
├── components/
│   ├── controls-panel.tsx # Zod-generated controls UI
│   ├── nextbook-shell.tsx # Main shell (client component)
│   ├── sidebar.tsx        # Navigation sidebar (client component)
│   ├── story-page.tsx     # Story rendering with error boundary
│   └── story-viewer.tsx   # Individual story viewer
├── utils/
│   ├── cn.ts              # Class name utility
│   └── schema.ts          # Zod schema introspection
├── index.ts               # Public exports
├── registry.tsx           # createStoryRegistry implementation
├── story.ts               # story() function and isStory()
└── types.ts               # TypeScript types
```

## Common Pitfalls

### 1. Forgetting "use client" on stories/index.ts
The loaders contain functions. Functions can't cross the server→client boundary.

### 2. Trying to render html/body in NextbookShell
Client Components cannot render `<html>` or `<body>`. These must be in the user's Server Component layout.

### 3. Making createStoryRegistry async
It was async before but that caused server/client boundary issues. It's now synchronous and only parses file paths.

### 4. CLI templates out of sync
`src/cli/templates.ts` contains the scaffolded files. These MUST match the current API.

## Testing

Run from package directory:
```bash
bun test
```

CLI tests are in `src/cli/init.test.ts`.
