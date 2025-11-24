# oRPC Contract Auditor

Audit an oRPC contract for compliance with project standards and best practices.

## Task

When this skill is invoked, perform a comprehensive audit of the specified oRPC contract and handler:

### 1. Contract Structure
- ✓ Imports `commonErrors` from `@workspace/api/orpc/errors`
- ✓ Uses `.errors()` to define error types
- ✓ Contract and handler are collocated in same directory
- ✓ Follows naming pattern: `{domain}.contract.ts` + `{domain}.handler.ts`
- ✓ Contract is imported and composed in `packages/api/src/orpc/contract/index.ts`

### 2. Error Handling
- ✓ Contract uses `UNAUTHORIZED` and `OPERATION_FAILED` from `commonErrors`
- ✓ No custom error types for simple operations
- ✓ Handler throws `ORPCError` instances that match contract-defined errors
- ✓ Error messages are user-friendly and descriptive

### 3. Input/Output Validation
- ✓ Contract defines `.input()` with Zod schema
- ✓ Contract defines `.output()` with Zod schema
- ✓ Handler NEVER re-defines `.input()` or `.output()` (contract already defines these)
- ✓ Input validation happens automatically via contract

### 4. Middleware Usage
- ✓ Public procedures use `os` implementer (base with logger)
- ✓ Protected procedures use `authorized` implementer (base + logger + auth)
- ✓ Middleware composition is correct: Logger → Auth
- ✓ Handler accesses correct context properties based on middleware

### 5. Router Integration
- ✓ Contract is properly exported from domain directory
- ✓ Main contract composes domain contract correctly
- ✓ Router uses `.router()` method at root level
- ✓ Contract is enforced at runtime

### 6. Code Quality
- ✓ No `any` types used
- ✓ No `interface` types (uses `type` instead)
- ✓ Imports are direct (no barrel files)
- ✓ Error handling uses `getErrorMessage()` utility
- ✓ Object parameters for functions with multiple args
- ✓ Reference links added for external documentation

## Output Format

Provide findings in this format:

```
## Audit Results: {domain} Contract

### ✅ Passing Checks
- List all checks that passed

### ⚠️  Issues Found
1. **[Severity]** Issue description
   - Location: file.ts:line
   - Fix: Specific instructions

### 📋 Recommendations
- Any optional improvements

### 🔧 Required Actions
- [ ] Action item 1
- [ ] Action item 2
```

## Usage

Invoke this skill when:
- Creating a new oRPC procedure
- Reviewing existing contracts
- Debugging contract/handler issues
- Before marking oRPC tasks as complete
