# Claude Code Hooks

Automation hooks that run during Claude Code operations to enforce project standards and provide intelligent assistance.

## Available Hooks

### Command Hooks

#### `session-start.sh`

**Trigger:** When Claude Code session starts

**Purpose:** Display project context and health status

**Shows:**

- Current git branch
- Last commit
- Uncommitted changes (count and list)
- Quick health check (bun ok status)

**Value:** Immediate orientation and context awareness

#### `post-schema-edit.sh`

**Trigger:** After editing `packages/api/src/db/schema.ts`

**Purpose:** Remind about migration workflow

**Shows:**

- Next steps: `bun db:generate`, review migration, `bun db:migrate`
- Reminder to update oRPC contracts if needed

#### `pre-bash.sh`

**Trigger:** Before any Bash command execution

**Purpose:** Prevents problematic commands that violate CLAUDE.md standards

**Blocks:**

- `sleep` commands (unnecessary and wasteful)
- Direct `tsc` usage (must use `bun ok` instead)
- `bun ok`/`bun ts`/`bun lint` from subdirectories (must run from root)
- `git stash` commands (no automatic hiding/restoring of changes)
- `git push`/`git commit` (must be explicitly requested by user)

**Example Error Messages:**

```
ERROR: sleep commands are not allowed per CLAUDE.md
ERROR: Use 'bun ok' instead of running tsc directly
ERROR: 'bun ok' must be run from project root
```

### Agent Hooks (AI-Powered)

#### React Component Validator

**Trigger:** After editing any file

**Purpose:** Intelligent validation of React components

**Checks:**

- Hooks called only at top level (Rules of Hooks)
- React 19.2 patterns: `<Activity>`, `useEffectEvent()`
- No manual `useMemo`/`useCallback` (React Compiler handles it)
- Proper error handling with `getErrorMessage()`

**Behavior:** Only outputs if issues found

#### oRPC Contract Validator

**Trigger:** After editing contract files

**Purpose:** Validate oRPC contract patterns

**Checks:**

- Errors imported from `@workspace/api/orpc/errors`
- `.errors()` used for error definitions
- No re-definition of `.input()` or `.output()` in handlers

**Behavior:** Only outputs if issues found

#### New File Checker

**Trigger:** After writing a new file

**Purpose:** Smart reminders for new files

**For oRPC procedures:**

- Verify contract follows project patterns
- Check domain directory organization
- Remind to update `contract/index.ts`
- Suggest running `audit-orpc-contract` skill

**For React components:**

- Verify React 19.2 patterns
- Check TypeScript conventions
- Ensure proper error handling

**Behavior:** Only outputs if important reminders needed

### Notification Hooks

#### Activity Logger

**Trigger:** On all notifications

**Purpose:** Create audit trail of Claude Code operations

**Location:** `.claude/activity.log`

**Format:**

```
[2025-11-24 10:30:45] {"tool": "Edit", "file": "path/to/file.ts", ...}
```

**Usage:** Debugging, learning, understanding what Claude did

## How Hooks Work

Hooks are shell scripts that Claude Code executes at specific points:

1. **Pre-hooks** run BEFORE the tool executes (can block execution)
2. **Post-hooks** run AFTER the tool completes (can perform cleanup/automation)

## Environment Variables Available

- `$CLAUDE_TOOL_NAME` - Name of the tool being used (e.g., "Bash", "Edit")
- `$CLAUDE_TOOL_COMMAND` - Full command for Bash tool
- `$CLAUDE_TOOL_FILE_PATH` - File path for Edit/Write tools

## Testing Hooks

Hooks run automatically during Claude Code operations. To test:

1. Try editing a TypeScript file - it should auto-format
2. Try running `sleep 1` - it should be blocked
3. Try running `tsc` directly - it should be blocked

## Disabling Hooks

If you need to temporarily disable hooks:

```bash
# Rename the hook to disable it
mv .claude/hooks/pre-bash.sh .claude/hooks/pre-bash.sh.disabled

# Re-enable later
mv .claude/hooks/pre-bash.sh.disabled .claude/hooks/pre-bash.sh
```
