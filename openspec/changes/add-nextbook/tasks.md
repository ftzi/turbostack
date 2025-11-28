## 1. Package Setup

- [ ] 1.1 Create `packages/nextbook/` directory structure
- [ ] 1.2 Configure `package.json` with exports, dependencies (React, Zod peer deps)
- [ ] 1.3 Configure `tsconfig.json` extending workspace config
- [ ] 1.4 Add package to workspace in root `package.json`

## 2. Core Story API

- [ ] 2.1 Implement `story()` function with TypeScript generics for Zod schema inference
- [ ] 2.2 Define `StoryConfig` type (schema optional, render required)
- [ ] 2.3 Define `Story` result type with `__nextbook` marker for detection
- [ ] 2.4 Export types for external consumption

## 3. Zod Schema Introspection

- [ ] 3.1 Implement `getSchemaDefaults()` - extract defaults via `schema.parse({})`
- [ ] 3.2 Implement `getSchemaShape()` - walk schema to get field definitions
- [ ] 3.3 Implement `zodTypeToControl()` - map Zod types to control types
- [ ] 3.4 Handle ZodDefault, ZodOptional unwrapping
- [ ] 3.5 Extract `.describe()` metadata for labels

## 4. File Discovery

- [ ] 4.1 Implement `findStoryFiles()` - recursive fs scan for `.story.tsx`
- [ ] 4.2 Implement `getStoryExports()` - dynamic import + export enumeration
- [ ] 4.3 Implement `generateNextbookParams()` - returns params array for generateStaticParams
- [ ] 4.4 Implement path utilities (parse, capitalize first char, build hierarchy)

## 5. UI Components

- [ ] 5.1 Implement `Sidebar` - tree navigation from story list
- [ ] 5.2 Implement `ControlsPanel` - form controls from Zod schema
- [ ] 5.3 Implement `StoryViewer` - renders story with live props
- [ ] 5.4 Implement `NextbookShell` - layout wrapper (sidebar + content area)
- [ ] 5.5 Style components with Tailwind (clean, minimal aesthetic)

## 6. Page Component

- [ ] 6.1 Implement `NextbookPage` - main page component
- [ ] 6.2 Handle story loading via dynamic import based on path params
- [ ] 6.3 Handle 404 for invalid story paths
- [ ] 6.4 Wire up controls state → story props

## 7. Integration Setup Files

- [ ] 7.1 Create example `app/ui/layout.tsx` with `NextbookShell`
- [ ] 7.2 Create example `app/ui/[...path]/page.tsx` with `NextbookPage`
- [ ] 7.3 Create example stories in `app/ui/stories/`

## 8. Documentation

- [ ] 8.1 Write `packages/nextbook/README.md` with:
  - Quick start (3-file setup)
  - Story API reference
  - Zod controls guide
  - Layout isolation patterns (route groups + useSelectedLayoutSegment fallback)
  - File naming conventions
- [ ] 8.2 Add inline JSDoc comments to exported functions/types

## 9. Testing & Validation

- [ ] 9.1 Test story discovery with nested directories
- [ ] 9.2 Test Zod schema → controls for all supported types
- [ ] 9.3 Test URL routing (`/ui/Forms/Input/Primary`)
- [ ] 9.4 Verify hot reload works for new/modified stories
- [ ] 9.5 Run `bun ok` to ensure type safety

## Dependencies

- Task 2 depends on nothing
- Task 3 depends on nothing
- Task 4 depends on Task 2 (needs Story type)
- Task 5 depends on Task 3 (ControlsPanel needs schema introspection)
- Task 6 depends on Tasks 4, 5
- Task 7 depends on Tasks 5, 6
- Task 8 depends on all implementation tasks
- Task 9 depends on Task 7
