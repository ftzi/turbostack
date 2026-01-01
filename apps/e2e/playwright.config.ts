import { defineConfig, devices } from "@playwright/test"

/**
 * Playwright configuration for e2e testing
 * Tests run against the mobile app's web build
 * Reference: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
	testDir: "./tests",
	testMatch: "**/*.e2e.ts",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "html",
	use: {
		baseURL: "http://localhost:8081",
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: {
		command: "cd ../mobile && bun run web",
		url: "http://localhost:8081",
		reuseExistingServer: !process.env.CI,
		timeout: 120000,
		stdout: "ignore",
		stderr: "pipe",
	},
})
