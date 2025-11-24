# Advanced Hooks Guide

This guide covers the advanced hook system configured for this project, including AI-powered agent hooks.

## Hook Types

### 1. Command Hooks
Traditional shell scripts that execute at specific lifecycle points.

**Pros:**
- Fast execution
- Simple to debug
- Predictable behavior

**Cons:**
- No intelligence - can't understand code context
- Limited to pattern matching

### 2. Agent Hooks (AI-Powered)
Use Claude to intelligently analyze code and provide context-aware feedback.

**Pros:**
- Understands code semantics
- Can provide intelligent suggestions
- Context-aware validation

**Cons:**
- Slower than command hooks (uses AI)
- Costs API credits
- Less predictable

### 3. Prompt Hooks
Quick LLM evaluations without full agent capabilities.

**Pros:**
- Faster than agent hooks
- Can make simple decisions
- Access to LLM understanding

**Cons:**
- No tool use (can't read files, etc.)
- Limited to prompt evaluation

## Our Configuration

### Session Start
```json
{
  "SessionStart": [{
    "hooks": [{
      "type": "command",
      "command": ".claude/hooks/session-start.sh",
      "statusMessage": "Loading project context..."
    }]
  }]
}
```

**When:** Start of every Claude Code session
**What:** Displays branch, commits, changes, health status
**Why:** Immediate orientation prevents mistakes

### Post Edit - Command Hooks
```json
{
  "PostToolUse": [{
    "matcher": "Edit",
    "hooks": [
      {
        "type": "command",
        "command": ".claude/hooks/post-edit.sh",
        "statusMessage": "Formatting code..."
      },
      {
        "type": "command",
        "command": ".claude/hooks/post-schema-edit.sh"
      }
    ]
  }]
}
```

**When:** After any Edit tool usage
**What:**
1. Auto-formats TypeScript/TSX files
2. Detects schema.ts edits and reminds about migrations

**Why:** Consistent formatting + prevents forgetting migration workflow

### Post Edit - Agent Hook
```json
{
  "type": "agent",
  "prompt": "Analyze the edited file. Check React hooks, React 19.2 patterns, oRPC contracts...",
  "timeout": 30,
  "statusMessage": "Validating code patterns..."
}
```

**When:** After any Edit tool usage (runs in parallel with command hooks)
**What:** Intelligently validates:
- React components (hooks rules, React 19.2 patterns)
- oRPC contracts (error handling, contract patterns)

**Why:** Catches pattern violations immediately, not at PR time

**Important:** Only outputs if issues found - stays silent on good code

### Post Write - Agent Hook
```json
{
  "matcher": "Write",
  "hooks": [{
    "type": "agent",
    "prompt": "Analyze the new file. Provide reminders for oRPC procedures, React components...",
    "timeout": 30,
    "statusMessage": "Checking new file..."
  }]
}
```

**When:** After creating a new file
**What:**
- For oRPC procedures: Remind to update contract composition
- For React components: Verify patterns and conventions

**Why:** New files often need follow-up steps - don't forget them

### Notification Hook
```json
{
  "Notification": [{
    "hooks": [{
      "type": "command",
      "command": "echo \"[timestamp] $ARGUMENTS\" >> .claude/activity.log"
    }]
  }]
}
```

**When:** Any notification event
**What:** Logs to `.claude/activity.log`
**Why:** Audit trail for debugging and learning

## Hook Environment Variables

Available in all hooks:

### Command Hooks
- `$CLAUDE_TOOL_NAME` - Tool that triggered the hook (e.g., "Edit", "Write")
- `$CLAUDE_TOOL_FILE_PATH` - File path for Edit/Write tools
- `$CLAUDE_TOOL_COMMAND` - Command for Bash tool
- `$ARGUMENTS` - JSON string with full tool arguments

### Agent/Prompt Hooks
- `$ARGUMENTS` - Use this placeholder in your prompt, will be replaced with tool arguments

Example:
```json
{
  "type": "agent",
  "prompt": "Analyze the file from $ARGUMENTS and check for issues."
}
```

## Performance Considerations

### Agent Hooks are Slow
Each agent hook:
- Takes 3-10 seconds (AI processing)
- Uses API credits
- Runs on every matching tool use

**Optimization strategies:**
1. Use specific matchers (e.g., "Edit" vs "*")
2. Keep prompts concise and focused
3. Set reasonable timeouts (30s is good default)
4. Make hooks output only when needed

### Command Hooks are Fast
Shell scripts execute in milliseconds - use liberally!

## Best Practices

### 1. Silent Success Pattern
Agent hooks should only output when there's something to say:

```
"Only output if you find issues. If everything looks good, output nothing."
```

This prevents noise and keeps the UX clean.

### 2. Specific Status Messages
Use clear status messages so users know what's happening:

```json
{
  "statusMessage": "Validating React hooks..."
}
```

### 3. Reasonable Timeouts
- Command hooks: Usually don't need timeouts (fast)
- Agent hooks: 30s is reasonable for most tasks
- Complex agent tasks: Up to 60s

### 4. Fail Gracefully
Hooks should never block work:
- Command hooks: Suppress errors with `2>/dev/null || true`
- Agent hooks: Timeout ensures they don't hang forever

### 5. Test Your Hooks
After adding a hook:
```bash
# For command hooks
.claude/hooks/your-hook.sh

# For agent hooks
# Edit a file and watch for the validation output
```

## Debugging Hooks

### Command Hook Issues
```bash
# Run the script directly
bash -x .claude/hooks/your-hook.sh

# Check environment variables
echo "$CLAUDE_TOOL_FILE_PATH"
```

### Agent Hook Issues
Check `.claude/activity.log` to see:
- When the hook triggered
- What arguments it received
- Any output or errors

### Common Problems

**Hook not running:**
- Check permissions: `chmod +x .claude/hooks/your-hook.sh`
- Verify matcher pattern
- Check hook is in correct lifecycle (SessionStart, PostToolUse, etc.)

**Hook too slow:**
- Reduce agent hook timeout
- Simplify agent prompt
- Consider using command hook instead

**Hook too noisy:**
- Add "only output if..." instruction
- Make matcher more specific
- Check if command is being called too often

## Advanced Patterns

### Conditional Hook Execution
```bash
#!/bin/bash
if [[ "$CLAUDE_TOOL_FILE_PATH" == *"packages/api/"* ]]; then
    # Only run for API files
    echo "API file detected!"
fi
```

### Chaining Multiple Checks
```json
{
  "hooks": [
    {"type": "command", "command": "hook1.sh"},
    {"type": "command", "command": "hook2.sh"},
    {"type": "agent", "prompt": "Final validation..."}
  ]
}
```

Hooks run in order, allowing progressive validation.

### Smart Memoization
For expensive checks, cache results:
```bash
#!/bin/bash
CACHE_FILE=".claude/.cache/last-check"
LAST_CHECK=$(cat "$CACHE_FILE" 2>/dev/null || echo "0")
CURRENT_TIME=$(date +%s)

if [ $((CURRENT_TIME - LAST_CHECK)) -gt 300 ]; then
    # Only run check every 5 minutes
    expensive_check
    echo "$CURRENT_TIME" > "$CACHE_FILE"
fi
```

## Security Considerations

**Hooks run arbitrary code** - be careful:
- Review hooks before running
- Don't put secrets in hooks (they're checked into git)
- Use environment variables for sensitive data
- Validate input in hooks that process external data

## Examples from Other Projects

### Run Tests After Changes
```json
{
  "PostToolUse": [{
    "matcher": "Edit",
    "hooks": [{
      "type": "command",
      "command": "npm test -- --changed --passWithNoTests"
    }]
  }]
}
```

### Enforce Commit Message Format
```json
{
  "PreToolUse": [{
    "matcher": "Bash(git commit*)",
    "hooks": [{
      "type": "prompt",
      "prompt": "Check if commit message follows conventional commits format. Reject if not."
    }]
  }]
}
```

### Auto-Update Dependencies
```json
{
  "SessionStart": [{
    "hooks": [{
      "type": "command",
      "command": "npm outdated | mail -s 'Outdated deps' dev@example.com"
    }]
  }]
}
```

## Resources

- Main hooks documentation: `hooks/README.md`
- Claude Code docs: https://docs.anthropic.com/claude-code
- Hook examples: `.claude/hooks/` directory

## Questions?

- Hook not working? Check `hooks/README.md`
- Need a new hook? Follow patterns in this guide
- Agent hook too slow? Consider command hook alternative
