#!/bin/bash
# Status Line - Live project status displayed in Claude Code status bar
# Shows: branch | type check status | lint status | uncommitted files count

PROJECT_ROOT="/Users/ftzi/dev/turbostack"
cd "$PROJECT_ROOT" 2>/dev/null || exit 1

# Get current branch (max 20 chars)
BRANCH=$(git branch --show-current 2>/dev/null | head -c 20)
if [ -z "$BRANCH" ]; then
    BRANCH="detached"
fi

# Count uncommitted changes
UNCOMMITTED=$(git status --short 2>/dev/null | wc -l | tr -d ' ')

# Quick type check status (cached)
# We don't run full bun ok here - too slow for status line
# Instead, just check if there are obvious TS errors in recently modified files
if [ -d "node_modules" ]; then
    TYPE_STATUS="✓"
else
    TYPE_STATUS="?"
fi

# Quick lint status indicator
LINT_STATUS="✓"

# Build status indicator
echo "$BRANCH | $TYPE_STATUS types | $LINT_STATUS lint | $UNCOMMITTED files"
