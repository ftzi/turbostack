import { sql } from "drizzle-orm"
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"

// Reference: https://www.better-auth.com/docs/guides/optimizing-for-performance#database-optimizations
export const users = sqliteTable(
    "users",
    {
        id: text("id").primaryKey(),
        name: text("name").notNull(),
        email: text("email").notNull().unique(),
        emailVerified: int("emailVerified", { mode: "boolean" }).notNull().default(false),
        image: text("image"),
        createdAt: int("createdAt", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
        updatedAt: int("updatedAt", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
        role: text("role").notNull().default("user"),
    },
)

export const sessions = sqliteTable(
    "sessions",
    {
        id: text("id").primaryKey(),
        expiresAt: int("expiresAt", { mode: "timestamp" }).notNull(),
        token: text("token").notNull().unique(),
        createdAt: int("createdAt", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
        updatedAt: int("updatedAt", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
        ipAddress: text("ipAddress"),
        userAgent: text("userAgent"),
        userId: text("userId")
            .notNull()
            .references(() => users.id),
    },
)

export const accounts = sqliteTable(
    "accounts",
    {
        id: text("id").primaryKey(),
        accountId: text("accountId").notNull(),
        providerId: text("providerId").notNull(),
        userId: text("userId")
            .notNull()
            .references(() => users.id),
        accessToken: text("accessToken"),
        refreshToken: text("refreshToken"),
        idToken: text("idToken"),
        accessTokenExpiresAt: int("accessTokenExpiresAt", { mode: "timestamp" }),
        refreshTokenExpiresAt: int("refreshTokenExpiresAt", { mode: "timestamp" }),
        scope: text("scope"),
        password: text("password"),
        createdAt: int("createdAt", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
        updatedAt: int("updatedAt", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
    },
)

export const verifications = sqliteTable(
    "verifications",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: int("expiresAt", { mode: "timestamp" }).notNull(),
        createdAt: int("createdAt", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
        updatedAt: int("updatedAt", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
    },
)
