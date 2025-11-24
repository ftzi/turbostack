/**
 * Shared test fixtures for oRPC tests
 * Centralized mock data to avoid duplication across test files
 */

type MockUser = {
	id: string
	email: string
	name: string
	image: string | null
	emailVerified: boolean
	createdAt: Date
	updatedAt: Date
}

type MockSession = {
	id: string
	userId: string
	token: string
	expiresAt: Date
	ipAddress: string
	userAgent: string
	createdAt: Date
	updatedAt: Date
}

/**
 * Creates a mock user with default or custom values
 */
export function createMockUser(overrides?: Partial<MockUser>): MockUser {
	return {
		id: "test-user-123",
		email: "test@example.com",
		name: "Test User",
		image: "https://example.com/avatar.jpg",
		emailVerified: false,
		createdAt: new Date("2024-01-01T00:00:00.000Z"),
		updatedAt: new Date("2024-01-02T00:00:00.000Z"),
		...overrides,
	}
}

/**
 * Creates a mock session with default or custom values
 */
export function createMockSession(overrides?: Partial<MockSession>): MockSession {
	return {
		id: "test-session-123",
		userId: "test-user-123",
		token: "test-token-123",
		expiresAt: new Date(Date.now() + 86400000), // 24 hours from now
		ipAddress: "127.0.0.1",
		userAgent: "test-user-agent",
		createdAt: new Date("2024-01-01T00:00:00.000Z"),
		updatedAt: new Date("2024-01-01T00:00:00.000Z"),
		...overrides,
	}
}

/**
 * Creates mock session data for Better Auth
 */
export function createMockSessionData(userOverrides?: Partial<MockUser>, sessionOverrides?: Partial<MockSession>) {
	const user = createMockUser(userOverrides)
	const session = createMockSession({ userId: user.id, ...sessionOverrides })

	return { user, session }
}
