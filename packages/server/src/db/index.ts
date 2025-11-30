import "server-only"
import * as schema from "./schema"

// Reference: https://pglite.dev/docs/orm-support
// Reference: https://orm.drizzle.team/docs/connect-pglite

const DATABASE_URL = process.env.DATABASE_URL

/** Whether the database is using PGlite (local development mode) */
export const isPglite = !DATABASE_URL

// Type definition for the database - using generic BaseSQLiteDatabase would be ideal
// but we use a union type for the two possible implementations
type NeonDb = ReturnType<typeof import("drizzle-orm/neon-http").drizzle<typeof schema>>
type PgliteDb = ReturnType<typeof import("drizzle-orm/pglite").drizzle<typeof schema>>
export type Database = NeonDb | PgliteDb

/**
 * Database client that automatically switches between:
 * - PGlite (local development): when DATABASE_URL is not set
 * - Neon (production): when DATABASE_URL is set
 */
function createDb(): Database {
	if (DATABASE_URL) {
		// Production: Use Neon serverless
		// biome-ignore lint/style/noCommonJs: Dynamic require needed for conditional loading
		const { neon } = require("@neondatabase/serverless") as typeof import("@neondatabase/serverless")
		// biome-ignore lint/style/noCommonJs: Dynamic require needed for conditional loading
		const { drizzle: drizzleNeon } = require("drizzle-orm/neon-http") as typeof import("drizzle-orm/neon-http")
		const sql = neon(DATABASE_URL)
		return drizzleNeon({ client: sql, schema })
	}

	// Local development: Use PGlite with file persistence
	// biome-ignore lint/style/noCommonJs: Dynamic require needed for conditional loading
	const { PGlite } = require("@electric-sql/pglite") as typeof import("@electric-sql/pglite")
	// biome-ignore lint/style/noCommonJs: Dynamic require needed for conditional loading
	const { drizzle: drizzlePglite } = require("drizzle-orm/pglite") as typeof import("drizzle-orm/pglite")
	const pgliteDir = process.env.PGLITE_DIR ?? ".pglite"
	const client = new PGlite(pgliteDir)
	return drizzlePglite({ client, schema })
}

export const db = createDb()
