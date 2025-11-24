# Code Standards Checker

Verify code changes comply with project coding standards defined in CLAUDE.md.

## Task

When this skill is invoked, review recent code changes for compliance:

### 1. TypeScript Standards
- ✓ No `any` types used
- ✓ No `as any` assertions
- ✓ No `interface` declarations (uses `type` instead)
- ✓ Proper type reuse (no duplicate types)
- ✓ Zod schemas for runtime validation where appropriate
- ✓ Object type properties have comments only when needed

### 2. Import Conventions
- ✓ No barrel files (index.ts that re-export)
- ✓ No re-exports from external libraries
- ✓ Direct imports from source files
- ✓ Package exports point to source files
- ✓ No circular dependencies

### 3. Function Standards
- ✓ Object parameters for multiple args
- ✓ Proper error handling with `getErrorMessage()`
- ✓ No `catch (error: any)` - uses `catch (error)` instead
- ✓ Contextual fallback error messages
- ✓ Optional chaining for callbacks: `onComplete?.(data)`

### 4. React Standards (if applicable)
- ✓ Hooks only at top level
- ✓ No early returns before hooks
- ✓ Hooks called in same order every render
- ✓ Uses `<Activity>` for hidden state preservation
- ✓ Uses `useEffectEvent()` for event-like logic
- ✓ Avoids manual `useMemo`/`useCallback` (React Compiler handles it)

### 5. Comments & Documentation
- ✓ No comments explaining recent changes
- ✓ Comments only for complex non-obvious logic
- ✓ JSDoc for public APIs
- ✓ Reference links for external documentation
- ✓ Format: `// Reference: https://example.com/docs`

### 6. Error Handling Pattern
- ✓ Imports `getErrorMessage` from `@workspace/shared/utils/error`
- ✓ Uses `catch (error)` without type annotation
- ✓ Provides contextual fallback messages
- ✓ Consistent error handling across codebase

### 7. Code Principles (Clean Code + SOLID + KISS + YAGNI)
- ✓ Single Responsibility - functions/classes do one thing
- ✓ Self-documenting code with meaningful names
- ✓ Simplest solution that solves the problem
- ✓ No premature optimization
- ✓ No functionality added "for future use"
- ✓ No over-engineering

### 8. Implementation Completeness
- ✓ No placeholder comments like "TODO" or "to be implemented"
- ✓ Full implementation of requested features
- ✓ No incomplete code left for later
- ✓ If incomplete, explicit explanation why

### 9. Logging & Debugging
- ✓ No console.log statements in committed code
- ✓ Uses Pino logger for server-side logging
- ✓ No debug code left in implementation
- ✓ If logging needed, uses structured logging

## Output Format

Provide findings in this format:

```
## Code Standards Check

### ✅ Compliant Areas
- List all areas that pass standards

### ❌ Violations Found
1. **[Standard]** Violation description
   - File: path/to/file.ts:line
   - Current: Code snippet showing issue
   - Required: Code snippet showing fix
   - Reason: Why this standard exists

### 💡 Suggestions
- Optional improvements for code quality

### 🔧 Required Fixes
- [ ] Fix issue 1
- [ ] Fix issue 2

### ✅ Post-Fix Verification
Run these commands after fixes:
- [ ] `bun ok` - Type check and lint
- [ ] Review changes in git diff
```

## Usage

Invoke this skill when:
- Completing a feature implementation
- Before running `bun ok`
- Reviewing code for quality
- Mentoring/explaining project standards
- Before creating PRs
