import { boolean, index, json, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

// Event category enum
export const eventCategoryEnum = pgEnum("event_category", ["work", "personal", "health", "learning", "other"])

// Reference: https://www.better-auth.com/docs/guides/optimizing-for-performance#database-optimizations
export const users = pgTable(
	"users",
	{
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		email: text("email").notNull().unique(),
		emailVerified: boolean("emailVerified").notNull().default(false),
		image: text("image"),
		createdAt: timestamp("createdAt").notNull().defaultNow(),
		updatedAt: timestamp("updatedAt").notNull().defaultNow(),
		role: text("role").notNull().default("user"),
	},
	(table) => [index("user_email_idx").on(table.email)],
)

export const sessions = pgTable(
	"sessions",
	{
		id: text("id").primaryKey(),
		expiresAt: timestamp("expiresAt").notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("createdAt").notNull().defaultNow(),
		updatedAt: timestamp("updatedAt").notNull().defaultNow(),
		ipAddress: text("ipAddress"),
		userAgent: text("userAgent"),
		userId: text("userId")
			.notNull()
			.references(() => users.id),
	},
	(table) => [index("session_user_id_idx").on(table.userId), index("session_token_idx").on(table.token)],
)

export const accounts = pgTable(
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
		accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
		refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("createdAt").notNull().defaultNow(),
		updatedAt: timestamp("updatedAt").notNull().defaultNow(),
	},
	(table) => [index("account_user_id_idx").on(table.userId)],
)

export const verifications = pgTable(
	"verifications",
	{
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expiresAt").notNull(),
		createdAt: timestamp("createdAt").notNull().defaultNow(),
		updatedAt: timestamp("updatedAt").notNull().defaultNow(),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
)

// Events table - for tasks and calendar events
export const events = pgTable(
	"events",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		title: text("title").notNull(),
		description: text("description"),
		location: text("location"),
		startTime: timestamp("start_time", { withTimezone: true }).notNull(),
		endTime: timestamp("end_time", { withTimezone: true }).notNull(),
		allDay: boolean("all_day").default(false).notNull(),
		category: eventCategoryEnum("category"),
		isRecurring: boolean("is_recurring").default(false).notNull(),
		recurrenceRule: json("recurrence_rule"), // JSON object for recurrence patterns
		isCompleted: boolean("is_completed").default(false).notNull(),
		completedAt: timestamp("completed_at", { withTimezone: true }),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		index("event_user_id_idx").on(table.userId),
		index("event_start_time_idx").on(table.startTime),
		index("event_category_idx").on(table.category),
	],
)

// Goals table
export const goals = pgTable(
	"goals",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		title: text("title").notNull(),
		description: text("description"),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [index("goal_user_id_idx").on(table.userId)],
)

// Type exports
export type Event = typeof events.$inferSelect
export type NewEvent = typeof events.$inferInsert
export type Goal = typeof goals.$inferSelect
export type NewGoal = typeof goals.$inferInsert
