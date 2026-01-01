import { defineConfig, devices } from "@playwright/test"

/**
 * Playwright configuration for e2e testing
 * Reference: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
	testDir: "./tests/e2e",
	testMatch: "**/*.e2e.ts",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "html",
	use: {
		baseURL: "http://localhost:3000",
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: {
		command: "bun dev:e2e",
		url: "http://localhost:3000",
		reuseExistingServer: !process.env.CI,
		timeout: 120000,
		stdout: "ignore",
		stderr: "pipe",
	},
})
