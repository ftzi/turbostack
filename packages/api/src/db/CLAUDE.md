# Database Schema

## Better Auth Performance Optimizations

Reference: https://www.better-auth.com/docs/guides/optimizing-for-performance#database-optimizations

### Required Database Indexes

For optimal Better Auth performance, the following fields **MUST** be indexed in `schema.ts`:

| Table | Fields | Plugin |
|-------|--------|--------|
| users | `email` | - |
| accounts | `userId` | - |
| sessions | `userId`, `token` | - |
| verifications | `identifier` | - |
| invitations | `email`, `organizationId` | organization |
| members | `userId`, `organizationId` | organization |
| organizations | `slug` | organization |
| passkey | `userId` | passkey |
| twoFactor | `secret` | twoFactor |

### CRITICAL: Manual Index Management

**DO NOT** use `bunx @better-auth/cli generate` to generate the schema, as it will overwrite the manually added indexes.

The Better Auth CLI does not include indexes in the generated schema. All indexes must be:
1. Added manually to the Drizzle schema definitions
2. Migrated using `bun run db:generate` followed by `bun run db:migrate`

**Example:**
```typescript
export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    // ... other fields
  },
  (table) => [index("user_email_idx").on(table.email)],
);
```

### Schema Workflow

1. **Modify Schema:** Edit `schema.ts` directly
2. **Generate Migration:** Run `bun run db:generate` (from project root)
3. **Apply Migration:** Run `bun run db:migrate` (from project root)
4. **NEVER:** Run `@better-auth/cli generate` - it will remove your indexes

### Current Schema

The schema in this directory already includes all required indexes for Better Auth core tables.
