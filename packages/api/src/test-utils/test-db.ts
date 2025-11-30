/**
 * Test database utilities using PGlite for isolated, real database testing.
 * Each test file can get a fresh in-memory database instance.
 */

import { resolve } from "node:path"
import { PGlite } from "@electric-sql/pglite"
import * as schema from "@workspace/server/db/schema"
import { drizzle } from "drizzle-orm/pglite"
import { migrate } from "drizzle-orm/pglite/migrator"

export type TestDb = ReturnType<typeof drizzle<typeof schema>>

/**
 * Creates a fresh in-memory PGlite database for testing.
 * Automatically applies all migrations.
 */
export async function createTestDb(): Promise<{ db: TestDb; client: PGlite }> {
	const client = new PGlite()
	const db = drizzle({ client, schema })

	// Apply migrations
	const migrationsFolder = resolve(__dirname, "../../../../server/drizzle")
	await migrate(db, { migrationsFolder })

	return { db, client }
}

/**
 * Cleans up all data from test tables.
 * Use this between tests to ensure isolation.
 */
export async function cleanupTestDb(db: TestDb): Promise<void> {
	// Delete in order to respect foreign key constraints
	await db.delete(schema.verifications)
	await db.delete(schema.sessions)
	await db.delete(schema.accounts)
	await db.delete(schema.users)
}

/**
 * Closes the PGlite connection.
 * Call this after all tests in a file are done.
 */
export async function closeTestDb(client: PGlite): Promise<void> {
	await client.close()
}
