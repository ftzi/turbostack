#!/usr/bin/env bun

/**
 * Minimal development setup script.
 * Only runs database initialization for PGlite if needed.
 *
 * For production/preview setup (Vercel, Neon, Resend), run `bun setup` instead.
 */

import { $ } from "bun"

async function main() {
	// Run database initialization (handles PGlite migrations if no DATABASE_URL)
	await $`bun run ./packages/tools/db-init.ts`
}

await main()
