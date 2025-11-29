#!/usr/bin/env bun

import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import * as readline from "node:readline"
import { emailEnabled } from "@workspace/shared/consts"
import { $ } from "bun"

// Based on Better Auth's: https://github.com/better-auth/better-auth/blob/main/docs/components/generate-secret.tsx
function generateRandomString(length = 32): string {
	const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	let result = ""
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length)
		result += characters[randomIndex]
	}
	return result
}

function checkVercelLinked(): boolean {
	const vercelDir = join(process.cwd(), ".vercel")
	const projectJson = join(vercelDir, "project.json")
	return existsSync(vercelDir) && existsSync(projectJson)
}

function checkLocalEnvVar(varName: string): boolean {
	const envLocalPath = join(process.cwd(), ".env.local")
	if (!existsSync(envLocalPath)) {
		return false
	}
	try {
		const content = readFileSync(envLocalPath, "utf-8")
		return content.includes(`${varName}=`)
	} catch {
		return false
	}
}

let SKIP_VERCEL = process.env.SKIP_VERCEL === "true" || process.argv.includes("--skip-vercel")
const NONINTERACTIVE = !process.stdin.isTTY || !process.stdout.isTTY

async function pullEnvFromVercel(): Promise<void> {
	if (SKIP_VERCEL) {
		// running in skip mode — do not call Vercel
		return
	}
	await $`bunx vercel env pull`.quiet()
}

/** Pull env from Vercel and check if var exists locally */
async function hasEnvVar(varName: string): Promise<boolean> {
	if (checkLocalEnvVar(varName)) {
		return true
	}
	if (SKIP_VERCEL) {
		// if we're skipping vercel, don't attempt to pull
		return false
	}
	await pullEnvFromVercel()
	return checkLocalEnvVar(varName)
}

function escapeRegExp(str: string) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function addOrUpdateLocalEnvVar(varName: string, value: string) {
	const envLocalPath = join(process.cwd(), ".env.local")
	let content = ""
	if (existsSync(envLocalPath)) {
		try {
			content = readFileSync(envLocalPath, "utf-8")
		} catch {
			content = ""
		}
	}
	const line = `${varName}=${value}`
	const regex = new RegExp(`^${escapeRegExp(varName)}=.*$`, "m")
	if (regex.test(content)) {
		content = content.replace(regex, line)
	} else {
		if (content.length && !content.endsWith("\n")) {
			content += "\n"
		}
		content += line + "\n"
	}
	writeFileSync(envLocalPath, content, "utf-8")
}

// Reference: https://bun.sh/docs/api/spawn
async function spawn(cmd: string[]): Promise<void> {
	const proc = Bun.spawn(cmd, {
		stdin: "inherit",
		stdout: "inherit",
		stderr: "inherit",
	})
	const exitCode = await proc.exited
	if (exitCode !== 0) {
		throw new Error(`Command failed with exit code ${exitCode}: ${cmd.join(" ")}`)
	}
}

function waitForEnter(message: string): Promise<void> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})

	if (NONINTERACTIVE) {
		// No terminal available — resolve immediately so this won't block, caller should
		// handle non-interactive cases differently if needed.
		console.log(`[skip] ${message}`)
		rl.close()
		return Promise.resolve()
	}
	return new Promise((resolve) => {
		rl.question(message, () => {
			rl.close()
			resolve()
		})
	})
}

function prompt(message: string): Promise<string> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})

	if (NONINTERACTIVE) {
		// In a non-interactive environment, we cannot prompt. Prefer explicit env or flags.
		rl.close()
		throw new Error(
			`${message} (non-interactive environment detected). Use SKIP_VERCEL=true or run interactively.`,
		)
	}
	return new Promise((resolve) => {
		rl.question(message, (answer) => {
			rl.close()
			resolve(answer.trim())
		})
	})
}

function success(message: string): void {
	console.log(`✅ ${message}`)
}

function step(title: string): void {
	console.log(`\n📌 ${title}\n`)
}

// Link Vercel Project
async function linkVercel(): Promise<void> {
	if (checkVercelLinked()) {
		return
	}

	// If user actively skipped via env or flags, do not prompt
	if (SKIP_VERCEL) {
		console.log("Skipping Vercel linking (SKIP_VERCEL=true or --skip-vercel)")
		return
	}

	if (NONINTERACTIVE) {
		console.log("Non-interactive environment detected — skipping Vercel link. Use SKIP_VERCEL to set explicitly.")
		return
	}

	step("Link Vercel Project")
	const answer = (await prompt("Do you want to link this project to Vercel? (Y/n): ")).toLowerCase()
	if (answer === "n" || answer === "no") {
		console.log("Skipping Vercel linking as requested")
		SKIP_VERCEL = true
		return
	}

	await spawn(["bunx", "vercel", "link"])
	success("Vercel project linked")
}

// Configure Local SQLite
async function configureLocalSqlite(): Promise<void> {
	if (!SKIP_VERCEL) return

	if (checkLocalEnvVar("DATABASE_URL") && checkLocalEnvVar("DB_CLIENT")) {
		return
	}

	step("Configure Local Database")

	console.log("Automatically configuring local SQLite database...")
	addOrUpdateLocalEnvVar("DB_CLIENT", "sqlite")
	addOrUpdateLocalEnvVar("DATABASE_URL", "file:./local.db")
	success("Local SQLite configured (DB_CLIENT=sqlite, DATABASE_URL=file:./local.db)")
	console.log("  (To use Postgres locally, update .env.local manually)")
}

// Install Neon Integration
async function installNeon(): Promise<void> {
	if (await hasEnvVar("DATABASE_URL")) {
		return
	}

	step("Install Neon Integration")

	if (SKIP_VERCEL) {
		console.log("Vercel linking skipped. Please add a DATABASE_URL to .env.local for local development.")
		console.log("You can create a free Neon DB or provide any Postgres URL for local testing.")
	} else {
		console.log("Please install the Neon integration:")
		console.log("1. Visit: https://vercel.com/marketplace/neon")
		console.log("2. Press Install and follow the given steps\n")
	}

	// biome-ignore lint/nursery/noUnnecessaryConditions: intentional infinite loop until condition met
	if (SKIP_VERCEL && NONINTERACTIVE && !checkLocalEnvVar("DATABASE_URL")) {
		throw new Error(
			"Non-interactive environment detected and SKIP_VERCEL is set but DATABASE_URL is missing in .env.local. Add it manually or run interactively.",
		)
	}
	while (true) {
		// biome-ignore lint/performance/noAwaitInLoops: sequential user interaction required
		await waitForEnter("Press Enter when done...")
		if (!SKIP_VERCEL) {
			await pullEnvFromVercel()
		}
		if (checkLocalEnvVar("DATABASE_URL")) {
			break
		}
		console.log("DATABASE_URL not found. Please complete the Neon installation.\n")
	}

	if (SKIP_VERCEL && NONINTERACTIVE && !checkLocalEnvVar("DATABASE_URL")) {
		throw new Error(
			"Non-interactive environment detected and SKIP_VERCEL is set but DATABASE_URL is missing in .env.local. Add it manually or run interactively.",
		)
	}

	success("Neon integration configured")
}

// Configure Resend Integration
async function configureResend(): Promise<void> {
	if (!emailEnabled) {
		return
	}

	const hasResendKey = await hasEnvVar("RESEND_API_KEY")
	const hasEmailDomain = await hasEnvVar("NEXT_PUBLIC_EMAIL_DOMAIN")

	if (hasResendKey && hasEmailDomain) {
		return
	}

	step("Configure Resend Integration")

	if (!hasResendKey) {
		console.log("Please configure Resend:")
		console.log("1. Visit: https://vercel.com/integrations/resend")
		console.log("2. Connect Account and select your domain")
		console.log("3. Save the Environment Variable\n")

		// biome-ignore lint/nursery/noUnnecessaryConditions: intentional infinite loop until condition met
		if (SKIP_VERCEL) {
			console.log("Vercel linking skipped. Please add RESEND_API_KEY to .env.local manually.")
			if (NONINTERACTIVE && !checkLocalEnvVar("RESEND_API_KEY")) {
				throw new Error(
					"Non-interactive environment detected and SKIP_VERCEL is set but RESEND_API_KEY is missing in .env.local. Add it manually or run interactively.",
				)
			}
			// biome-ignore lint/nursery/noUnnecessaryConditions: intentional
			while (true) {
				await waitForEnter("Press Enter when done...")
				if (checkLocalEnvVar("RESEND_API_KEY")) break
				console.log("RESEND_API_KEY not found. Please add it to .env.local.\n")
			}
		} else {
			while (true) {
				// biome-ignore lint/performance/noAwaitInLoops: sequential user interaction required
				await waitForEnter("Press Enter when done...")
				await pullEnvFromVercel()
				if (checkLocalEnvVar("RESEND_API_KEY")) {
					break
				}
				console.log("RESEND_API_KEY not found. Please complete the Resend setup.\n")
			}
		}
	}

	if (!hasEmailDomain) {
		if (NONINTERACTIVE && SKIP_VERCEL) {
			const envDomain = process.env.NEXT_PUBLIC_EMAIL_DOMAIN
			if (!envDomain) {
				throw new Error(
					"Non-interactive: NEXT_PUBLIC_EMAIL_DOMAIN not provided. Set NEXT_PUBLIC_EMAIL_DOMAIN in environment or .env.local or run interactively.",
				)
			}
			addOrUpdateLocalEnvVar("NEXT_PUBLIC_EMAIL_DOMAIN", envDomain)
			console.log("Added NEXT_PUBLIC_EMAIL_DOMAIN to .env.local from environment")
		} else {
			const domain = await prompt("Enter your email domain (e.g., example.com): ")
			if (SKIP_VERCEL) {
				addOrUpdateLocalEnvVar("NEXT_PUBLIC_EMAIL_DOMAIN", domain)
				console.log("Added NEXT_PUBLIC_EMAIL_DOMAIN to .env.local")
			} else {
				await $`bunx vercel env add NEXT_PUBLIC_EMAIL_DOMAIN`.env({ VERCEL_ENV_VALUE: domain }).quiet()
				await pullEnvFromVercel()
				console.log("Added NEXT_PUBLIC_EMAIL_DOMAIN to all environments")
			}
		}
	}

	success("Resend integration configured")
}

// Configure Better Auth Secrets
async function configureBetterAuth(): Promise<void> {
	if (await hasEnvVar("BETTER_AUTH_SECRET")) {
		return
	}

	step("Configure Better Auth Secrets")

	console.log("Generating and adding Better Auth secrets...")

	try {
		if (SKIP_VERCEL) {
			const seed = generateRandomString()
			addOrUpdateLocalEnvVar("BETTER_AUTH_SECRET", seed)
			success("Better Auth secret added to .env.local")
		} else {
			await $`printf ${generateRandomString()} | bunx vercel env add BETTER_AUTH_SECRET development`.quiet()
			await $`printf ${generateRandomString()} | bunx vercel env add BETTER_AUTH_SECRET preview`.quiet()
			await $`printf ${generateRandomString()} | bunx vercel env add BETTER_AUTH_SECRET production`.quiet()
			await pullEnvFromVercel()
			success("Better Auth secrets configured")
		}
	} catch {
		throw new Error(
			"Failed to add Better Auth secrets. Please add BETTER_AUTH_SECRET manually via: bunx vercel env add BETTER_AUTH_SECRET or add to .env.local",
		)
	}
}

// Run Database Migrations
async function runMigrations(): Promise<void> {
	step("Run Database Migrations")

	console.log("Running database migrations...")
	const hasDb = await hasEnvVar("DATABASE_URL")
	if (!hasDb) {
		if (NONINTERACTIVE && SKIP_VERCEL) {
			throw new Error(
				"DATABASE_URL missing in .env.local and running in non-interactive SKIP_VERCEL mode. Add DATABASE_URL or run setup interactively.",
			)
		}
		if (!NONINTERACTIVE) {
			const ans = (await prompt("DATABASE_URL not found. Do you want to skip running migrations? (y/N): ")).toLowerCase()
			if (ans === "y" || ans === "yes") {
				console.log("Skipping database migrations.")
				return
			}
		}
		// if interactive and user chose not to skip, we'll attempt migrations and let them fail if DB isn't reachable
	}
	try {
		await $`bun db:migrate`
		success("Database migrations complete")
	} catch (err) {
		throw new Error(
			`Failed to run migrations. Please ensure DATABASE_URL is set and try again. (${err instanceof Error ? err.message : String(err)})`,
		)
	}
}

// Main setup flow
async function main(): Promise<void> {
	console.clear()
	console.log("🚀 Welcome to Turbostack Setup!\n")
	console.log("This wizard will guide you through setting up your project.")
	console.log("Feel free to read packages/tools/setup.ts to see exactly what this runs.\n")

	try {
		await linkVercel()
		await configureLocalSqlite()
		await installNeon()
		await configureResend()
		await configureBetterAuth()
		await runMigrations()

		console.log("\n✅ Setup complete!\n")
	} catch (error) {
		console.error("\n❌ Setup failed:", error instanceof Error ? error.message : error)
		process.exit(1)
	}
}

await main()
