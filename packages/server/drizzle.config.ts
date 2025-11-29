import { defineConfig } from "drizzle-kit"

const isSqlite = process.env.DB_CLIENT === "sqlite"

export default defineConfig({
	out: isSqlite ? "./drizzle/sqlite" : "./drizzle/postgres",
	schema: isSqlite ? "./src/db/schema.sqlite.ts" : "./src/db/schema.ts",
	dialect: isSqlite ? "sqlite" : "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL ?? "",
	},
})
