## Context

Storybook is the industry standard for component development, but requires significant setup overhead for Next.js projects: separate webpack config, Tailwind duplication, CSS imports, and a parallel build process.

Nextbook takes a different approach: leverage Next.js's existing infrastructure. Stories are just pages, discovery uses `generateStaticParams`, and the app's existing Tailwind/CSS configuration applies automatically.

**Target users:** Next.js developers who want component isolation without Storybook's complexity.

## Goals / Non-Goals

**Goals:**
- Zero-config setup (3 files to get started)
- Type-safe story API with full IntelliSense
- Auto-generated controls from Zod schemas
- Beautiful, minimal UI
- File-based discovery and navigation
- Production-ready (can be extracted as npm package)

**Non-Goals:**
- Feature parity with Storybook
- Theme switching (complex provider issues)
- Plugin/addon system
- MDX documentation

## Decisions

### 1. Always use `story()` wrapper

**Decision:** All stories must use `story()`, even simple ones without controls.

**Rationale:**
- Consistent API - developers learn one pattern
- Enables future extensibility (add props to story config)
- IntelliSense shows available options
- Easy to add schema later without changing structure

**Alternative considered:** Allow raw component exports, detect via `typeof === 'function'`. Rejected because it creates two patterns and migration friction.

### 2. Zod for schema and controls

**Decision:** Use Zod schemas for control generation with `.default()` for initial values and `.describe()` for labels.

**Rationale:**
- Single source of truth (type + default + description)
- Already in our stack (Zod 4)
- Rich type introspection via `._def`
- `.default()` means `schema.parse({})` gives all defaults

**Control mapping:**
| Zod Type | Control |
|----------|---------|
| `z.string()` | Text input |
| `z.number()` | Number input |
| `z.boolean()` | Toggle |
| `z.enum([...])` | Select dropdown |

Complex types (objects, arrays, unions) fall back to JSON editor in future versions.

### 3. Build-time file discovery

**Decision:** Scan `.story.tsx` files at build time via `generateStaticParams`, not runtime API.

**Rationale:**
- Works with static export
- No API route needed
- Hot reload works in dev (Next.js re-runs generateStaticParams)
- Named exports discovered via dynamic import

**Implementation:**
```tsx
// generateStaticParams scans fs, imports each file, enumerates exports
export async function generateStaticParams() {
  const files = findStoryFiles('app/ui/stories')
  const params = []
  for (const file of files) {
    const mod = await import(`@/app/ui/stories/${file}`)
    const exports = Object.keys(mod).filter(k => !k.startsWith('_'))
    for (const name of exports) {
      params.push({ path: [...file.split('/'), name] })
    }
  }
  return params
}
```

### 4. Path-based naming convention

**Decision:** File path becomes sidebar hierarchy, named exports become variants.

**Rationale:**
- Zero config - no title/category props needed
- Matches mental model (folder = section)
- Encourages organization
- Supports kebab-case, camelCase, PascalCase (first char uppercased for display)

**Example:**
```
Forms/text-input.story.tsx → "Forms / Text-input"
export const WithLabel      → "Forms / Text-input / WithLabel"
```

### 5. Layout isolation is developer's responsibility

**Decision:** Document the pattern, don't provide abstractions.

**Rationale:**
- Every project's layout is different
- Providing utilities adds maintenance burden
- Next.js already has the tools (`useSelectedLayoutSegment`)
- Developers understand their own setup

**Documentation provides:**
1. Optimal approach: Route groups with separate root layouts
2. Fallback approach: `useSelectedLayoutSegment` early return
3. Link to Next.js docs

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Build-time discovery misses new files | Dev server hot reloads; document that new files need save |
| Zod introspection is internal API | Pin to Zod 4, abstract behind helper functions |
| No theme toggle frustrates users | Document in v1.1 roadmap, explain provider complexity |
| Layout isolation confuses users | Clear README examples for both approaches |

## Package Structure

```
packages/nextbook/
├── package.json
├── src/
│   ├── index.ts                 # Main exports
│   ├── story.ts                 # story() function
│   ├── components/
│   │   ├── NextbookShell.tsx    # Sidebar + content wrapper
│   │   ├── Sidebar.tsx          # Navigation tree
│   │   ├── StoryViewer.tsx      # Renders story with controls
│   │   └── ControlsPanel.tsx    # Zod → form controls
│   ├── utils/
│   │   ├── discovery.ts         # File system scanning
│   │   ├── schema-to-controls.ts # Zod introspection
│   │   └── path.ts              # Path parsing, capitalization
│   ├── page.tsx                 # NextbookPage component
│   └── params.ts                # generateNextbookParams
└── tsconfig.json
```

## Open Questions

1. **Should we support `default` export as an alias for a "Default" named export?** Leaning no - named exports only for consistency.

2. **Should controls panel be collapsible?** Probably yes for better story viewing.

3. **What's the minimum story file content?** Just `export const X = story({ render: () => <div/> })`
