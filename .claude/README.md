# Claude Code Configuration

This directory contains all Claude Code configuration for the Turbostack project. These files enhance AI-assisted development with automation, quality checks, and specialized capabilities.

## 📁 Directory Structure

```
.claude/
├── README.md                    # This file - overview of setup
├── settings.local.json          # Settings: permissions, hooks, status line
├── status-line.sh               # Live status bar script
├── activity.log                 # Activity audit trail (gitignored)
├── PERMISSIONS.md               # Detailed permission documentation
├── HOOKS.md                     # Advanced hooks guide
└── hooks/                       # Automation hooks
    ├── README.md                # Hook documentation
    ├── session-start.sh         # Project context on startup
    ├── post-edit.sh             # Auto-format after edits
    ├── post-schema-edit.sh      # Migration workflow reminder
    └── pre-bash.sh              # Block problematic commands
```

## 🚀 Quick Start

All team members automatically inherit this configuration. The setup includes:

1. **Status Line** - Live project status in status bar
2. **Automation Hooks** - Command hooks + AI-powered agent hooks
3. **Optimized Permissions** - Streamlined workflow with safety guardrails
4. **Activity Logging** - Audit trail of all operations

## 🎯 Key Features

### Status Line (Live)
Live status bar shows project state:
```
main | ✓ types | ✓ lint | 3 files
```
Always visible - instant awareness of project health.

### Session Start Context
Every session starts with:
- Current branch and last commit
- Uncommitted changes (count + list)
- Quick health check (`bun ok` status)

Immediate orientation = fewer mistakes.

### Hooks (Automatic)

**Command Hooks:**
- **session-start.sh** - Shows project status on startup (branch, commits, health check)
- **post-edit.sh** - Auto-formats TypeScript/TSX files with Biome
- **post-schema-edit.sh** - Reminds about migration workflow after schema changes
- **pre-bash.sh** - Blocks problematic commands (sleep, tsc, git stash, etc.)

**Agent Hooks (AI-Powered):**
- **React Component Validator** - Checks hooks, React 19.2 patterns, error handling
- **oRPC Contract Validator** - Validates contract patterns and error definitions
- **New File Checker** - Smart reminders for new oRPC procedures and React components

**Notification Hooks:**
- **Activity Logger** - Creates audit trail in `.claude/activity.log`

### Permissions (Automatic)
Optimized for productivity and safety:

**Allowed (no prompt):**
- `bun ok`, `bun knip`, `bun build`, `bun dev`
- `bun db:*` (all database commands)
- Git read operations (`status`, `diff`, `log`)
- Documentation fetching (Drizzle, Better Auth, oRPC, etc.)

**Denied (blocked):**
- `tsc` directly (must use `bun ok`)
- `npm`, `yarn`, `pnpm` (project uses Bun)
- `git push`, `git commit` (must be explicit)

**Ask first (prompt):**
- `bun install`, `bunx`
- `git restore`, `git reset`
- `rm -rf`

See `PERMISSIONS.md` for complete details.

## 📚 Documentation

Each subsystem has detailed documentation:

- **README.md** - This file - complete overview and quick start
- **HOOKS.md** - Advanced hooks guide with agent hooks, patterns, examples
- **PERMISSIONS.md** - Permission system: syntax, examples, testing
- **hooks/README.md** - All available hooks with triggers and purposes

## 🔧 Customization

### Adding New Hooks
1. Create script in `.claude/hooks/`
2. Make executable: `chmod +x .claude/hooks/your-hook.sh`
3. Document in `hooks/README.md`

### Updating Permissions
1. Edit `.claude/settings.local.json`
2. Follow syntax rules in `PERMISSIONS.md`
3. Test with actual commands

## 🎓 Best Practices

### For Developers
- **Trust the automation** - Hooks and permissions are designed for smooth workflow
- **Read the docs** - Each README has useful context and examples

### For AI (Claude)
- **Use TodoWrite extensively** - Track all multi-step work
- **Follow CLAUDE.md strictly** - All rules exist for good reasons

## 🏆 Benefits

**Productivity:**
- No interruptions for common safe commands
- Automatic formatting on edits

**Quality:**
- Hooks prevent common mistakes
- Consistent codebase via automation

**Safety:**
- Destructive commands require approval
- Wrong tools are blocked
- Git operations are controlled

## 🔄 Team Synchronization

All configuration is checked into git:
- `.claude/settings.local.json` - Shared permissions
- `.claude/hooks/` - Shared automation

Every team member gets the same optimized experience automatically.

## 📖 Learn More

- Main project docs: `/CLAUDE.md`
- Hook details: `hooks/README.md`
- Permission system: `PERMISSIONS.md`

## 💡 Tips

**Session starts:**
```
Every session shows: branch, commits, changes, health check
→ Instant context awareness
```

**Status line:**
```
Always visible: main | ✓ types | ✓ lint | 3 files
→ Know project state at a glance
```

**Editing files:**
```
Auto-formats on save + AI validates patterns
→ Catches issues immediately
```

**Schema changes:**
```
Edit schema.ts → Automatic reminder about migrations
→ Never forget db:generate
```

**For all work:**
```
Always ends with `bun ok` to verify types and lint
```

**Activity logging:**
```
Check .claude/activity.log to see what Claude did
→ Debugging and learning
```

## 🤝 Contributing

Improvements welcome! When modifying:

1. **Update docs** - Keep READMEs current
2. **Test thoroughly** - Verify hooks work as expected
3. **Keep it simple** - KISS principle applies to configuration too
4. **Document why** - Explain reasoning for future maintainers

## ❓ Questions?

- Configuration issues? Check individual READMEs
- Permission problems? See `PERMISSIONS.md`
- Hook not working? Check `hooks/README.md`

---

**Last Updated:** 2025-11-24
**Maintained By:** Development Team
