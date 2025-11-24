# Claude Code Permissions

This document explains the permission system configured for this project.

## Permission Tiers

### Allowed (No Prompt)
Commands that are safe and frequently used - execute without asking:

**Build & Quality:**
- `bun ok` - Type checking and linting
- `bun knip` - Find unused code
- `bun build` - Build the project
- `bun dev` - Start dev server
- `bun tsw` - TypeScript watch mode

**Database:**
- `bun db:*` - All database commands (studio, generate, migrate)

**Tooling:**
- `bunx shadcn:*` - Add UI components
- `bunx @biomejs/biome:*` - Format code

**File Operations:**
- `ls`, `cat`, `mkdir`, `chmod`, `mv`, `cp`, `rm` - Basic file operations

**Git (Read-only):**
- `git status`, `git diff`, `git log`, `git add` - Safe git commands

**Web & MCP:**
- Documentation sites: Drizzle, Better Auth, oRPC, Knip
- All MCP servers: better-auth, next-devtools, context7
- Web search for documentation

**Sub-Agents:**
- Explore, Plan, and general-purpose agents

### Denied (Always Block)
Commands that violate project standards or are dangerous:

- `tsc` - Must use `bun ok` instead (per CLAUDE.md)
- `git push`, `git commit`, `git stash` - Must be explicit user request
- `npm`, `yarn`, `pnpm` - Project uses Bun only

**Note:** The pre-bash hook also blocks `sleep` commands, but permission system can't match mid-string wildcards.

### Ask First (Prompt)
Potentially destructive commands that require confirmation:

- `bun install:*` - Installing dependencies
- `bunx:*` - Running arbitrary executables
- `git restore`, `git checkout`, `git reset` - Git state changes
- `rm -rf:*` - Recursive deletion

## How It Works

1. **Allow list** = commands execute immediately
2. **Deny list** = commands are blocked with error message
3. **Ask list** = user gets prompted to approve/deny
4. **Unlisted** = user gets prompted (default behavior)

## Combined with Hooks

Permissions work alongside hooks for defense in depth:

- **Permissions** = Fast declarative rules (no script execution)
- **Hooks** = Smart logic-based validation (runs scripts)

Example: `sleep` commands are blocked by pre-bash.sh hook since permissions can't match `*sleep*` pattern.

## Updating Permissions

Edit `.claude/settings.local.json` to modify:

```json
{
  "permissions": {
    "allow": ["Bash(your command:*)"],
    "deny": ["Bash(blocked command:*)"],
    "ask": ["Bash(prompt command:*)"]
  }
}
```

**Syntax Rules:**
- Use `:*` for prefix matching (e.g., `Bash(git:*)`)
- Cannot use wildcards mid-string (e.g., `Bash(*sleep*)` is invalid)
- Be specific: `Bash(bun ok)` is better than `Bash(bun:*)`

## Permission Pattern Examples

```json
"Bash(exact-command)"           // Matches exactly: exact-command
"Bash(prefix:*)"                // Matches: prefix anything
"WebFetch(domain:example.com)"  // Matches: fetches from example.com
"mcp__server-name__*"           // Matches: all tools from MCP server
"Task(subagent_type:Explore)"   // Matches: Explore agent only
```

## Why This Setup?

**Productivity:**
- Common commands (`bun ok`, `git status`) don't interrupt flow
- Quality tools (`knip`, `biome`) can run freely

**Safety:**
- Destructive commands (`git push`, `rm -rf`) require approval
- Wrong package managers (`npm`, `yarn`) are blocked
- Git operations that change state need confirmation

**Standards:**
- Blocks `tsc` directly (enforces `bun ok` pattern)
- Blocks `git commit` unless explicitly requested
- Prevents stashing changes automatically

## Testing Permissions

To verify the setup works:

```bash
# Should execute without prompt
bun ok

# Should be denied
tsc --noEmit

# Should prompt for approval
bun install lodash

# Should be blocked by hook (sleep commands)
sleep 1
```

## Team Sync

This file (`.claude/settings.local.json`) is checked into git so the entire team uses the same permission rules. Any updates benefit everyone automatically.
