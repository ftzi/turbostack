#!/bin/bash
# Prevent problematic commands from running
# This hook runs before any Bash tool execution

# Block sleep commands (per CLAUDE.md)
if [[ "$CLAUDE_TOOL_COMMAND" == *"sleep"* ]]; then
    echo "ERROR: sleep commands are not allowed per CLAUDE.md"
    echo "Sleep commands are unnecessary and wasteful - remove them from your workflow"
    exit 1
fi

# Block direct tsc usage (must use 'bun ok' instead)
if [[ "$CLAUDE_TOOL_COMMAND" == *"tsc"* ]] && [[ "$CLAUDE_TOOL_COMMAND" != *"bunx"* ]] && [[ "$CLAUDE_TOOL_COMMAND" != *"npx"* ]]; then
    echo "ERROR: Use 'bun ok' instead of running tsc directly (per CLAUDE.md)"
    echo "Correct command: bun ok"
    exit 1
fi

# Block bun ts/lint from subdirectories
if [[ "$CLAUDE_TOOL_COMMAND" == "bun ok"* ]] || [[ "$CLAUDE_TOOL_COMMAND" == "bun ts"* ]] || [[ "$CLAUDE_TOOL_COMMAND" == "bun lint"* ]]; then
    CURRENT_DIR=$(pwd)
    PROJECT_ROOT="/Users/ftzi/dev/turbostack"

    if [[ "$CURRENT_DIR" != "$PROJECT_ROOT" ]]; then
        echo "ERROR: 'bun ok', 'bun ts', and 'bun lint' must be run from project root (per CLAUDE.md)"
        echo "Current directory: $CURRENT_DIR"
        echo "Project root: $PROJECT_ROOT"
        echo "Use: cd /Users/ftzi/dev/turbostack && $CLAUDE_TOOL_COMMAND"
        exit 1
    fi
fi

# Block git stash commands (per CLAUDE.md)
if [[ "$CLAUDE_TOOL_COMMAND" == *"git stash"* ]]; then
    echo "ERROR: git stash commands are not allowed without explicit user instruction (per CLAUDE.md)"
    echo "Do not hide or restore changes automatically"
    exit 1
fi

# Block git push/commit without explicit instruction
if [[ "$CLAUDE_TOOL_COMMAND" == *"git push"* ]] || [[ "$CLAUDE_TOOL_COMMAND" == *"git commit"* ]]; then
    echo "WARNING: Git operations must be explicitly requested by the user (per CLAUDE.md)"
    echo "Command blocked: $CLAUDE_TOOL_COMMAND"
    exit 1
fi
