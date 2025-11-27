#!/usr/bin/env bun

import { existsSync } from "node:fs"
import { join } from "node:path"
import { $ } from "bun"
import { execaCommand } from "execa"
import { Listr } from "listr2"

type SetupContext = {
	vercelLinked: boolean
	neonInstalled: boolean
	resendConfigured: boolean
	betterAuthSecretsSet: boolean
	envPulled: boolean
	migrationsRun: boolean
}

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

async function checkEnvVar(varName: string): Promise<boolean> {
	try {
		const result = await $`bunx vercel env ls ${varName}`.quiet()
		return result.exitCode === 0 && result.stdout.toString().includes(varName)
	} catch {
		return false
	}
}

function checkEnvPulled(): boolean {
	const envFile = join(process.cwd(), ".env")
	return existsSync(envFile)
}

const tasks = new Listr<SetupContext>(
	[
		{
			title: "Step 1: Link Vercel Project",
			task: async (ctx, task) => {
				ctx.vercelLinked = await checkVercelLinked()

				if (ctx.vercelLinked) {
					task.skip("Vercel project already linked")
					return
				}

				try {
					const execute = execaCommand("bunx vercel link", {
						stdin: "inherit",
					})

					// Pipe stdout and stderr to task output
					if (execute.stdout) {
						execute.stdout.pipe(task.stdout())
					}
					if (execute.stderr) {
						execute.stderr.pipe(task.stdout())
					}

					// Wait for process to complete
					await execute

					ctx.vercelLinked = true
				} catch (_error) {
					throw new Error("Failed to link Vercel project. Please run manually: bunx vercel link")
				}
			},
		},
		{
			title: "Step 2: Install Neon Integration",
			task: async (ctx, task) => {
				const hasDatabase = await checkEnvVar("DATABASE_URL")
				ctx.neonInstalled = hasDatabase

				if (ctx.neonInstalled) {
					task.skip("Neon integration already configured")
					return
				}

				task.output =
					"Please install the Neon integration:\n" +
					"1. Visit: https://vercel.com/marketplace/neon\n" +
					"2. Select 'Specific Project' and choose your project\n" +
					"3. Complete the installation and database creation\n" +
					"4. Press Enter when done..."

				// Wait for user confirmation
				await new Promise<void>((resolve) => {
					process.stdin.once("data", () => {
						resolve()
					})
				})

				// Verify installation
				const verified = await checkEnvVar("DATABASE_URL")
				if (!verified) {
					throw new Error("DATABASE_URL not found. Please complete the Neon installation and run setup again.")
				}

				ctx.neonInstalled = true
			},
		},
		{
			title: "Step 3: Configure Resend Integration",
			task: async (ctx, task) => {
				const hasResendKey = await checkEnvVar("RESEND_API_KEY")
				const hasEmailDomain = await checkEnvVar("NEXT_PUBLIC_EMAIL_DOMAIN")
				ctx.resendConfigured = hasResendKey && hasEmailDomain

				if (ctx.resendConfigured) {
					task.skip("Resend integration already configured")
					return
				}

				// Check if Resend API key exists
				if (!hasResendKey) {
					task.output =
						"Please configure Resend:\n" +
						"1. Visit: https://vercel.com/integrations/resend\n" +
						"2. Connect Account and select your domain\n" +
						"3. Save the Environment Variable\n" +
						"4. Press Enter when done..."

					await new Promise<void>((resolve) => {
						process.stdin.once("data", () => {
							resolve()
						})
					})

					const verified = await checkEnvVar("RESEND_API_KEY")
					if (!verified) {
						throw new Error("RESEND_API_KEY not found. Please complete the Resend setup and run setup again.")
					}
				}

				// Add email domain
				if (!hasEmailDomain) {
					task.output = "Enter your email domain (e.g., example.com):"

					const domain = await new Promise<string>((resolve) => {
						process.stdin.once("data", (data) => {
							resolve(data.toString().trim())
						})
					})

					await $`bunx vercel env add NEXT_PUBLIC_EMAIL_DOMAIN`.env({ VERCEL_ENV_VALUE: domain }).quiet()

					task.output = "Adding NEXT_PUBLIC_EMAIL_DOMAIN to all environments..."
				}

				ctx.resendConfigured = true
			},
		},
		{
			title: "Step 4: Configure Better Auth Secrets",
			task: async (ctx, task) => {
				const hasSecret = await checkEnvVar("BETTER_AUTH_SECRET")
				ctx.betterAuthSecretsSet = hasSecret

				if (ctx.betterAuthSecretsSet) {
					task.skip("Better Auth secrets already configured")
					return
				}

				task.output = "Generating and adding Better Auth secrets..."

				try {
					// Generate secrets for all environments
					await $`printf ${generateRandomString()} | bunx vercel env add BETTER_AUTH_SECRET development`.quiet()
					await $`printf ${generateRandomString()} | bunx vercel env add BETTER_AUTH_SECRET preview`.quiet()
					await $`printf ${generateRandomString()} | bunx vercel env add BETTER_AUTH_SECRET production`.quiet()

					ctx.betterAuthSecretsSet = true
				} catch (_error) {
					throw new Error(
						"Failed to add Better Auth secrets. Please add BETTER_AUTH_SECRET manually via: bunx vercel env add BETTER_AUTH_SECRET",
					)
				}
			},
		},
		{
			title: "Step 5: Pull Environment Variables & Run Migrations",
			task: async (_ctx, task) =>
				task.newListr(
					[
						{
							title: "Pull environment variables from Vercel",
							task: async (ctx, subtask) => {
								ctx.envPulled = checkEnvPulled()

								if (ctx.envPulled) {
									subtask.skip(".env file already exists")
									return
								}

								subtask.output = "Running bun env..."
								await $`bun env`
								ctx.envPulled = true
							},
						},
						{
							title: "Run database migrations",
							task: async (ctx, subtask) => {
								if (!ctx.envPulled) {
									throw new Error("Environment variables must be pulled first")
								}

								subtask.output = "Running database migrations..."
								try {
									await $`bun db:migrate`
									ctx.migrationsRun = true
								} catch (_error) {
									throw new Error("Failed to run migrations. Please ensure DATABASE_URL is set and try again.")
								}
							},
						},
					],
					{ concurrent: false },
				),
		},
		{
			title: "Step 6: Vercel Configuration Instructions",
			task: (_ctx, task) => {
				task.output =
					"\nFinal steps (manual configuration):\n\n" +
					"1. Enable Vercel's Fluid Compute:\n" +
					"   Visit: https://vercel.com/fluid\n" +
					"   - Press 'Enable Fluid'\n" +
					"   - In Advanced Settings > Function Region, select the same/nearest region as your database\n\n" +
					"2. Alternative: If you don't want Fluid Compute:\n" +
					"   - Go to Advanced Settings\n" +
					"   - Set 'Function Max Duration' to 60s (default is 10s)\n\n" +
					"Press Enter to complete setup..."

				return new Promise<void>((resolve) => {
					process.stdin.once("data", () => {
						resolve()
					})
				})
			},
		},
	],
	{
		ctx: {
			vercelLinked: false,
			neonInstalled: false,
			resendConfigured: false,
			betterAuthSecretsSet: false,
			envPulled: false,
			migrationsRun: false,
		},
		rendererOptions: {
			collapseSubtasks: false,
		},
	},
)

console.log("\n🚀 Welcome to Turbostack Setup!\n")
console.log("This wizard will guide you through setting up your project.\n")

try {
	await tasks.run()
	console.log("\n✅ Setup complete! You're ready to start developing.\n")
	console.log("Run 'bun dev' to start the development server.\n")
} catch (error) {
	console.error("\n❌ Setup failed:", error)
	process.exit(1)
}
