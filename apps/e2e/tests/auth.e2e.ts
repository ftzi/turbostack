import { expect, test } from "@playwright/test"

// Regex patterns at top level for performance
const DASHBOARD_HEADING_REGEX = /dashboard/i

/**
 * @spec [HAB.auth.signup.email]
 * @spec [HAB.auth.signup.access]
 * @spec [HAB.auth.session.reload]
 * @spec [HAB.auth.signout.dashboard]
 * @spec [HAB.auth.signout.protected]
 */
test("complete authentication flow", async ({ page }) => {
	// Generate unique email for this test run
	const testEmail = `test-${Date.now()}@example.com`
	const testPassword = "TestPassword123!"
	const testName = "Test User"

	// Test: Sign up with email and password [HAB.auth.signup.email]
	await page.goto("/(auth)/sign-up")
	await page.waitForLoadState("networkidle")

	// Wait for auth form to load
	await page.waitForSelector('input[id="name"]', { timeout: 10000 })

	// Fill in sign-up form
	await page.fill('input[id="name"]', testName)
	await page.fill('input[id="email"]', testEmail)
	await page.fill('input[id="password"]', testPassword)

	// Click sign up button
	await page.click('button:has-text("Continue")')

	// Test: Account is created and user is redirected to dashboard
	await expect(page).toHaveURL("/(dashboard)", { timeout: 15000 })

	// Test: User can access protected route [HAB.auth.signup.access]
	const dashboardHeading = page.locator("h1, h2").filter({ hasText: DASHBOARD_HEADING_REGEX })
	await expect(dashboardHeading.first()).toBeVisible()

	// Test: Session persists on reload [HAB.auth.session.reload]
	await page.reload()
	await expect(page).toHaveURL("/(dashboard)")
	await expect(dashboardHeading.first()).toBeVisible()

	// Test: Navigate to another protected route
	await page.goto("/(dashboard)/tasks")
	await expect(page).toHaveURL("/(dashboard)/tasks")

	// Navigate back to dashboard for sign out test
	await page.goto("/(dashboard)")

	// Test: Sign out [HAB.auth.signout.dashboard]
	// Find and click the sign out button in the mobile app
	// Note: This selector may need adjustment based on actual mobile UI structure
	await page.click('button:has-text("Sign out")')

	// Test: User is redirected to home page
	await expect(page).toHaveURL("/", { timeout: 10000 })

	// Test: Cannot access protected routes after signout [HAB.auth.signout.protected]
	await page.goto("/(dashboard)")

	// Should be redirected away from dashboard
	await page.waitForLoadState("networkidle")
	const currentURL = new URL(page.url()).pathname
	expect(currentURL === "/(dashboard)").toBe(false)
})

/**
 * @spec [HAB.auth.protection.redirect]
 */
test("unauthenticated user cannot access dashboard", async ({ page }) => {
	// Test: Attempting to access protected route redirects
	await page.goto("/(dashboard)")
	await page.waitForLoadState("networkidle")

	// Should not be on dashboard
	const currentPath = new URL(page.url()).pathname
	expect(currentPath === "/(dashboard)").toBe(false)

	// Should be redirected to sign-in or home
	expect(currentPath.includes("/(auth)") || currentPath.includes("/sign-in") || currentPath === "/").toBe(true)
})

/**
 * @spec [HAB.auth.signin.email]
 */
test("existing user can sign in", async ({ page }) => {
	// First create a test user
	const testEmail = `test-signin-${Date.now()}@example.com`
	const testPassword = "TestPassword123!"
	const testName = "Test SignIn User"

	// Sign up
	await page.goto("/(auth)/sign-up")
	await page.waitForSelector('input[id="name"]', { timeout: 10000 })
	await page.fill('input[id="name"]', testName)
	await page.fill('input[id="email"]', testEmail)
	await page.fill('input[id="password"]', testPassword)
	await page.click('button:has-text("Continue")')

	// Wait for redirect to dashboard
	await expect(page).toHaveURL("/(dashboard)", { timeout: 15000 })

	// Sign out
	await page.click('button:has-text("Sign out")')
	await expect(page).toHaveURL("/", { timeout: 10000 })

	// Now test sign in
	await page.goto("/(auth)/sign-in")
	await page.waitForSelector('input[id="email"]', { timeout: 10000 })

	// Fill in sign-in form
	await page.fill('input[id="email"]', testEmail)
	await page.fill('input[id="password"]', testPassword)

	// Click sign in button
	await page.click('button:has-text("Continue")')

	// Should be redirected to dashboard
	await expect(page).toHaveURL("/(dashboard)", { timeout: 15000 })

	// Verify authenticated
	const dashboardHeading = page.locator("h1, h2").filter({ hasText: DASHBOARD_HEADING_REGEX })
	await expect(dashboardHeading.first()).toBeVisible()
})
