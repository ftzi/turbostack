#!/usr/bin/env bun

/**
 * Database initialization script for local development.
 * Automatically applies migrations to PGlite when DATABASE_URL is not set.
 *
 * This script is run automatically by `bun dev` to ensure the local database
 * is ready before starting the development server.
 */

import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { PGlite } from "@electric-sql/pglite"
import { drizzle } from "drizzle-orm/pglite"
import { migrate } from "drizzle-orm/pglite/migrator"

const DATABASE_URL = process.env.DATABASE_URL
const PGLITE_DIR = process.env.PGLITE_DIR ?? ".pglite"

async function main() {
	// Skip if using external database (Neon)
	if (DATABASE_URL) {
		console.log("📦 Using external database (DATABASE_URL is set)")
		return
	}

	console.log("🗄️  Using PGlite local database")

	const pglitePath = resolve(process.cwd(), PGLITE_DIR)
	const isNewDatabase = !existsSync(pglitePath)

	if (isNewDatabase) {
		console.log(`📁 Creating new PGlite database at ${PGLITE_DIR}/`)
	}

	// Initialize PGlite
	const client = new PGlite(pglitePath)
	const db = drizzle({ client })

	// Find migrations folder relative to the server package
	const migrationsFolder = resolve(process.cwd(), "packages/server/drizzle")

	if (!existsSync(migrationsFolder)) {
		console.error(`❌ Migrations folder not found: ${migrationsFolder}`)
		process.exit(1)
	}

	// Run migrations
	console.log("🔄 Applying database migrations...")
	try {
		await migrate(db, { migrationsFolder })
		console.log("✅ Database ready")
	} catch (error) {
		console.error("❌ Migration failed:", error)
		process.exit(1)
	}

	// Close the connection
	await client.close()
}

await main()
