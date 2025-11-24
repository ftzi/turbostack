#!/bin/bash
# Session Start Hook - Display project status when Claude Code starts
# Provides immediate context about project state

PROJECT_ROOT="/Users/ftzi/dev/turbostack"
cd "$PROJECT_ROOT" || exit 1

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Turbostack Project Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Branch info
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)
if [ -n "$CURRENT_BRANCH" ]; then
    echo "🌿 Branch: $CURRENT_BRANCH"
else
    echo "🌿 Branch: (detached HEAD)"
fi

# Last commit
LAST_COMMIT=$(git log -1 --oneline 2>/dev/null)
if [ -n "$LAST_COMMIT" ]; then
    echo "📝 Last commit: $LAST_COMMIT"
fi

echo ""

# Git status (short format)
GIT_STATUS=$(git status --short 2>/dev/null)
if [ -n "$GIT_STATUS" ]; then
    echo "📂 Uncommitted changes:"
    echo "$GIT_STATUS" | head -10

    # Count files
    MODIFIED_COUNT=$(echo "$GIT_STATUS" | grep -c "^ M" || echo "0")
    ADDED_COUNT=$(echo "$GIT_STATUS" | grep -c "^A " || echo "0")
    UNTRACKED_COUNT=$(echo "$GIT_STATUS" | grep -c "^??" || echo "0")

    echo ""
    echo "   Modified: $MODIFIED_COUNT | Added: $ADDED_COUNT | Untracked: $UNTRACKED_COUNT"
else
    echo "✓ Working directory clean"
fi

echo ""
echo "🔍 Quick health check..."

# Run bun ok and capture result
if BUN_OK_OUTPUT=$(bun ok 2>&1); then
    echo "✓ Type checking and linting passed"
else
    # Show first few errors/warnings
    echo "⚠️  Issues found:"
    echo "$BUN_OK_OUTPUT" | grep -E "(error|warning)" | head -5
    echo ""
    echo "   Run 'bun ok' to see all issues"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Ready to code!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
