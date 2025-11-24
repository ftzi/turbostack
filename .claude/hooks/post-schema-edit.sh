#!/bin/bash
# Post-Schema-Edit Hook - Remind to generate migration after schema changes
# Triggers when packages/api/src/db/schema.ts is edited

if [[ "$CLAUDE_TOOL_FILE_PATH" == *"packages/api/src/db/schema.ts"* ]]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📝 Database schema modified!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Next steps:"
    echo "  1. Run: bun db:generate"
    echo "  2. Review migration in packages/api/drizzle/"
    echo "  3. Run: bun db:migrate"
    echo ""
    echo "💡 Don't forget to update oRPC contracts if needed!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
fi
