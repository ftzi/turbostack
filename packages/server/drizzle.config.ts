import { defineConfig } from "drizzle-kit"

// Reference: https://orm.drizzle.team/docs/connect-pglite

const DATABASE_URL = process.env.DATABASE_URL
const PGLITE_DIR = process.env.PGLITE_DIR ?? ".pglite"

/**
 * Drizzle Kit configuration that supports both:
 * - PGlite (local development): when DATABASE_URL is not set
 * - Neon (production): when DATABASE_URL is set
 */
export default defineConfig({
	out: "./drizzle",
	schema: "./src/db/schema.ts",
	dialect: "postgresql",
	...(DATABASE_URL
		? {
				// Production: Use Neon
				dbCredentials: {
					url: DATABASE_URL,
				},
			}
		: {
				// Local development: Use PGlite
				driver: "pglite",
				dbCredentials: {
					url: PGLITE_DIR,
				},
			}),
})
