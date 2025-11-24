# Database Schema Reviewer

Review database schema changes for best practices, performance, and maintainability.

## Task

When this skill is invoked, perform a comprehensive review of database schema changes:

### 1. Schema Design
- ✓ Table names use snake_case (Drizzle convention)
- ✓ Column names use camelCase (TypeScript convention)
- ✓ Primary keys are defined correctly
- ✓ Foreign keys have proper relationships and cascade rules
- ✓ Nullable vs non-nullable columns are appropriate
- ✓ Default values are set where appropriate

### 2. Indexes
- ✓ Primary keys have indexes (automatic)
- ✓ Foreign keys have indexes (MUST be added manually)
- ✓ Frequently queried columns have indexes
- ✓ Composite indexes for multi-column queries
- ✓ Unique constraints where appropriate
- ✓ No redundant indexes

**CRITICAL**: Drizzle does NOT auto-index foreign keys - must be added manually!

### 3. Better Auth Integration
- ✓ Better Auth tables follow official schema patterns
- ✓ User table has performance indexes: email, emailVerified
- ✓ Session table has performance indexes: userId, token, expiresAt
- ✓ Account table has performance indexes: userId, providerId
- ✓ Verification table has performance indexes: identifier, token
- ✓ Additional custom fields don't break Better Auth functionality

### 4. Data Types
- ✓ Appropriate data types for each column
- ✓ Text vs varchar usage is correct
- ✓ Timestamps use timestamp type
- ✓ Boolean columns are boolean type
- ✓ JSON columns use jsonb (not json)

### 5. Migrations
- ✓ Migration file generated correctly via `bun db:generate`
- ✓ Migration includes all schema changes
- ✓ Migration SQL is safe (no data loss risk)
- ✓ Rollback considerations documented if complex

### 6. Security
- ✓ No sensitive data stored in plain text
- ✓ Password fields use proper hashing (Better Auth handles this)
- ✓ No SQL injection vulnerabilities in custom queries
- ✓ Row-level security considerations noted if needed

### 7. Performance
- ✓ Indexes on high-frequency query columns
- ✓ No N+1 query risks with relations
- ✓ Appropriate use of relations vs manual joins
- ✓ Consider pagination for large result sets

## Output Format

Provide findings in this format:

```
## Database Schema Review

### ✅ Well-Designed
- List all positive findings

### ⚠️  Issues Found
1. **[Severity]** Issue description
   - Location: schema.ts:line
   - Impact: Performance/Security/Maintainability
   - Fix: Specific SQL or code change

### 🚀 Performance Recommendations
- Suggested indexes
- Query optimization tips

### 🔧 Required Changes
- [ ] Add missing foreign key index
- [ ] Update migration
- [ ] etc.

### 📝 Migration Checklist
- [ ] Run `bun db:generate` to create migration
- [ ] Review generated SQL in drizzle/ directory
- [ ] Test migration in development
- [ ] Run `bun db:migrate` to apply
- [ ] Update oRPC contracts if schema changes affect API
- [ ] Run `bun ok` to verify types
```

## Usage

Invoke this skill when:
- Creating new database tables
- Modifying existing schema
- Adding Better Auth integration
- Before running `bun db:migrate`
- Investigating performance issues
