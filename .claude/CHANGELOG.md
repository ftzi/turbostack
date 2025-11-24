# Claude Code Configuration Changelog

## 2025-11-24 - Advanced Hooks & Intelligence Update

### 🎉 Major Features Added

#### 1. Live Status Line
**File:** `status-line.sh` + configured in `settings.local.json`

Live status bar showing:
```
main | ✓ types | ✓ lint | 3 files
```

**Impact:** Continuous awareness of project health without asking.

---

#### 2. Session Start Hook
**File:** `hooks/session-start.sh`

Displays on every session start:
- Current branch and last commit
- Uncommitted changes (count + list)
- Quick health check (bun ok status)

**Impact:** Immediate context = fewer mistakes, faster orientation.

---

#### 3. Schema Edit Reminder
**File:** `hooks/post-schema-edit.sh`

Automatically detects `schema.ts` edits and reminds:
1. Run `bun db:generate`
2. Review migration
3. Run `bun db:migrate`
4. Update oRPC contracts

**Impact:** Never forget migration workflow steps.

---

#### 4. Agent Hooks (AI-Powered) ⭐

##### React Component Validator
Runs after editing any file. Checks:
- Hooks only at top level (Rules of Hooks)
- React 19.2 patterns: `<Activity>`, `useEffectEvent()`
- No manual `useMemo`/`useCallback`
- Proper error handling with `getErrorMessage()`

**Impact:** Catches React pattern violations immediately.

##### oRPC Contract Validator
Runs after editing files. Validates:
- Errors imported from `@workspace/api/orpc/errors`
- `.errors()` used for error definitions
- No `.input()`/`.output()` re-definition

**Impact:** Ensures oRPC contracts follow project standards.

##### New File Checker
Runs after creating new files. Provides smart reminders:
- For oRPC procedures: Update contract composition
- For React components: Verify patterns

**Impact:** Don't forget follow-up steps for new files.

**Note:** All agent hooks only output when they find issues - silent on good code.

---

#### 5. Activity Logger
**File:** `.claude/activity.log` (gitignored)

Logs all Claude Code operations with timestamps:
```
[2025-11-24 10:30:45] {"tool": "Edit", "file": "path/to/file.ts"}
```

**Impact:** Audit trail for debugging and learning.

---

### 📝 Documentation Added

1. **HOOKS.md** - Comprehensive guide to hook system
   - Hook types (command, agent, prompt)
   - Environment variables
   - Best practices and patterns
   - Performance considerations
   - Security notes

2. **Updated hooks/README.md** - Full hook documentation
   - All available hooks listed
   - Triggers and purposes
   - Agent hook details

3. **Updated .claude/README.md** - Reflected all new features
   - Status line
   - Session start
   - Agent hooks
   - Activity logging

4. **Updated PERMISSIONS.md** - No changes needed

---

### 🔧 Configuration Changes

**settings.local.json:**
- Added `statusLine` configuration
- Added `hooks.SessionStart` configuration
- Added `hooks.PostToolUse` with multiple hooks:
  - Command hooks (post-edit.sh, post-schema-edit.sh)
  - Agent hooks (React validator, oRPC validator)
- Added `hooks.Notification` for activity logging

**.gitignore:**
- Added `.claude/activity.log` (keeps log local)

---

### 🎯 Benefits Summary

**Awareness:**
- Live status line = always know project state
- Session start = immediate context on startup
- Activity log = audit trail of operations

**Quality:**
- Agent hooks = intelligent pattern validation
- Schema reminders = never forget migrations
- React validator = catch hook violations early

**Automation:**
- Auto-formatting on edits (existing)
- Smart reminders based on file changes
- AI-powered validation without manual checks

---

### 📊 Hook Performance

**Command Hooks:** ~10-50ms each (fast)
**Agent Hooks:** ~3-10s each (uses AI, runs in background)

Agent hooks are configured with 30s timeout and only output when needed.

---

### 🚀 What Changed for Users

**Session Start:**
- Every session now shows project status automatically
- See branch, commits, changes, health immediately

**While Editing:**
- Auto-format still happens (existing)
- AI now validates patterns (new)
- Schema edits show migration reminder (new)

**Status Bar:**
- Live project status always visible (new)

**Activity Log:**
- Can review what Claude did in `.claude/activity.log` (new)

---

### 🔮 Future Enhancements

Potential additions:
- More domain-specific skills (Next.js routes, React components)
- Prompt templates directory
- Pre-compact hook for state preservation
- More agent hooks for specific patterns

---

### 📚 How to Use

Everything is automatic! Just:
1. Start a Claude Code session → See project status
2. Edit files → Auto-format + AI validation
3. Edit schema.ts → Get migration reminder
4. Check status bar → See live project state
5. Review `.claude/activity.log` → Audit trail

---

### 🤝 Team Impact

All configuration is in git - entire team benefits:
- Same hooks
- Same validations
- Same reminders
- Consistent experience

---

### ✅ Verified

- All hooks created and made executable
- Status line script configured
- Agent hooks configured with proper prompts
- Activity log initialized
- Documentation complete
- `bun ok` passes ✓

---

**Total Files Added/Modified:**
- Added: `status-line.sh`
- Added: `hooks/session-start.sh`
- Added: `hooks/post-schema-edit.sh`
- Added: `HOOKS.md`
- Added: `CHANGELOG.md` (this file)
- Added: `.claude/activity.log`
- Modified: `settings.local.json` (hooks + status line)
- Modified: `hooks/README.md` (documented all hooks)
- Modified: `.claude/README.md` (reflected new features)
- Modified: `.gitignore` (ignore activity.log)

**Lines of Configuration:** ~150 lines of hook configuration + ~1000 lines of documentation
