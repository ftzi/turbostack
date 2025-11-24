# Claude Code Skills

Reusable specialized capabilities for common development tasks in this project.

## What are Skills?

Skills are specialized prompts that Claude Code can invoke to perform domain-specific tasks. They act as expert consultants for specific aspects of the codebase.

## Available Skills

### `audit-orpc-contract`
**Purpose:** Audit oRPC contracts and handlers for best practices

**When to use:**
- Creating new oRPC procedures
- Reviewing existing contracts
- Debugging contract/handler issues
- Before marking oRPC tasks complete

**Checks:**
- Contract structure and organization
- Error handling patterns
- Input/output validation
- Middleware composition
- Router integration
- Code quality standards

### `review-db-schema`
**Purpose:** Review database schema changes for best practices

**When to use:**
- Creating new database tables
- Modifying existing schema
- Adding Better Auth integration
- Before running migrations
- Investigating performance issues

**Checks:**
- Schema design patterns
- Index strategy (including manual FK indexes)
- Better Auth integration
- Data types and constraints
- Migration safety
- Security considerations
- Performance optimization

### `check-code-standards`
**Purpose:** Verify code compliance with project standards

**When to use:**
- Completing feature implementations
- Before running `bun ok`
- Code quality reviews
- Before creating PRs

**Checks:**
- TypeScript conventions (no `any`, no `interface`)
- Import patterns (no barrel files)
- Function standards (object params, error handling)
- React patterns (hooks, React 19 features)
- Comments and documentation
- Clean Code + SOLID + KISS + YAGNI principles
- Implementation completeness

## How to Use Skills

Skills are invoked by Claude Code automatically based on context, or manually requested:

**Automatic invocation:**
```
# Claude detects you're creating an oRPC procedure
# Automatically runs audit-orpc-contract skill
```

**Manual invocation:**
```
You: "Audit the user contract with the audit-orpc-contract skill"
Claude: *invokes skill and provides detailed audit results*
```

## Creating New Skills

To create a custom skill for your team:

1. Create a new `.md` file in `.claude/skills/`
2. Use this template:

```markdown
# Skill Name

Brief description of what this skill does.

## Task

When this skill is invoked, perform these steps:

### 1. Check Category
- ✓ Item to verify
- ✓ Another item

### 2. Another Category
- ✓ More checks

## Output Format

Describe the expected output format

## Usage

When to invoke this skill
```

3. Document in this README
4. Test by requesting Claude to use it

## Skill Development Tips

- **Be specific:** Clear checklist-style tasks work best
- **Use checkmarks:** ✓ format makes it easy to scan results
- **Include examples:** Show good vs bad patterns
- **Format output:** Consistent output format helps readability
- **Reference CLAUDE.md:** Link to project standards
- **Keep focused:** One skill = one responsibility

## Skills vs Sub-Agents

**Skills:**
- Specialized review/audit tasks
- Follow specific checklists
- Invoked explicitly or by context
- Return structured findings

**Sub-Agents:**
- Autonomous exploration/research
- Iterate until goal achieved
- Invoked for open-ended questions
- Return comprehensive answers

Use skills for quality checks, use sub-agents for discovery.
