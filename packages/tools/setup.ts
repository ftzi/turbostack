#!/usr/bin/env bun

import { existsSync, readFileSync } from "node:fs"
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

async function pullEnvFromVercel(): Promise<void> {
	await $`bunx vercel env pull`.quiet()
}

/** Pull env from Vercel and check if var exists locally */
async function hasEnvVar(varName: string): Promise<boolean> {
	if (checkLocalEnvVar(varName)) {
		return true
	}
	await pullEnvFromVercel()
	return checkLocalEnvVar(varName)
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

	step("Link Vercel Project")
	await spawn(["bunx", "vercel", "link"])
	success("Vercel project linked")
}

// Install Neon Integration
async function installNeon(): Promise<void> {
	if (await hasEnvVar("DATABASE_URL")) {
		return
	}

	step("Install Neon Integration")

	console.log("Please install the Neon integration:")
	console.log("1. Visit: https://vercel.com/marketplace/neon")
	console.log("2. Press Install and follow the given steps\n")

	// biome-ignore lint/nursery/noUnnecessaryConditions: intentional infinite loop until condition met
	while (true) {
		// biome-ignore lint/performance/noAwaitInLoops: sequential user interaction required
		await waitForEnter("Press Enter when done...")
		await pullEnvFromVercel()
		if (checkLocalEnvVar("DATABASE_URL")) {
			break
		}
		console.log("DATABASE_URL not found. Please complete the Neon installation.\n")
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

	if (!hasEmailDomain) {
		const domain = await prompt("Enter your email domain (e.g., example.com): ")
		await $`bunx vercel env add NEXT_PUBLIC_EMAIL_DOMAIN`.env({ VERCEL_ENV_VALUE: domain }).quiet()
		await pullEnvFromVercel()
		console.log("Added NEXT_PUBLIC_EMAIL_DOMAIN to all environments")
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
		await $`printf ${generateRandomString()} | bunx vercel env add BETTER_AUTH_SECRET development`.quiet()
		await $`printf ${generateRandomString()} | bunx vercel env add BETTER_AUTH_SECRET preview`.quiet()
		await $`printf ${generateRandomString()} | bunx vercel env add BETTER_AUTH_SECRET production`.quiet()
		await pullEnvFromVercel()
		success("Better Auth secrets configured")
	} catch {
		throw new Error(
			"Failed to add Better Auth secrets. Please add BETTER_AUTH_SECRET manually via: bunx vercel env add BETTER_AUTH_SECRET",
		)
	}
}

// Run Database Migrations
async function runMigrations(): Promise<void> {
	step("Run Database Migrations")

	console.log("Running database migrations...")
	try {
		await $`bun db:migrate`
		success("Database migrations complete")
	} catch {
		throw new Error("Failed to run migrations. Please ensure DATABASE_URL is set and try again.")
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
