#!/usr/bin/env bun
import { defineCommand, runMain } from "citty"
import { init } from "./init"

const main = defineCommand({
	meta: {
		name: "nextbook",
		version: "0.0.1",
		description: "Zero-config component stories for Next.js",
	},
	args: {
		workspace: {
			type: "boolean",
			alias: "w",
			description: "Use @workspace/nextbook imports (monorepo setup)",
		},
		force: {
			type: "boolean",
			alias: "f",
			description: "Overwrite existing files",
		},
	},
	run({ args }) {
		console.log("Initializing Nextbook...")

		const result = init({
			workspace: args.workspace,
			skipExisting: !args.force,
		})

		if (result.created.length > 0) {
			console.log("\nCreated files:")
			for (const file of result.created) {
				console.log(`  + ${file}`)
			}
		}

		if (result.skipped.length > 0) {
			console.log("\nSkipped (already exist):")
			for (const file of result.skipped) {
				console.log(`  - ${file}`)
			}
		}

		if (result.errors.length > 0) {
			console.error("\nErrors:")
			for (const error of result.errors) {
				console.error(`  ! ${error}`)
			}
			process.exit(1)
		}

		if (result.success) {
			console.log("\nNextbook initialized successfully!")
			console.log("\nNext steps:")
			console.log("  1. Start your dev server: npm run dev")
			console.log("  2. Visit http://localhost:3000/ui")
			console.log("  3. Add more stories in app/ui/stories/")
		}
	},
})

void runMain(main)
