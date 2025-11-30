import { mock } from "bun:test"

// Mock server-only to prevent errors in test environment
mock.module("server-only", () => ({}))

// Mock server environment variables for tests
// Note: DATABASE_URL is NOT set to trigger PGlite mode
mock.module("@workspace/server/env", () => ({
	serverEnv: {
		DATABASE_URL: undefined, // Use PGlite
		BETTER_AUTH_SECRET: "test-secret-minimum-32-characters-long",
		BETTER_AUTH_URL: "http://localhost:3000",
		GOOGLE_CLIENT_ID: undefined,
		GOOGLE_CLIENT_SECRET: undefined,
		RESEND_API_KEY: undefined,
		PGLITE_DIR: undefined, // Use in-memory for tests
	},
	isLocalDev: true,
}))

// Create reusable mocks for database operations
// These are used for tests that don't need a real database
const mockFindFirst = mock(() => Promise.resolve(null))
const mockFindMany = mock(() => Promise.resolve([]))
const mockReturning = mock(() => Promise.resolve([]))
const mockWhere = mock(() => ({ returning: mockReturning }))
const mockSet = mock(() => ({ where: mockWhere }))
const mockUpdate = mock(() => ({ set: mockSet }))

// Mock database module
// Tests can use real PGlite via test-utils/test-db.ts when needed
mock.module("@workspace/server/db", () => ({
	db: {
		query: {
			users: {
				findFirst: mockFindFirst,
				findMany: mockFindMany,
			},
		},
		update: mockUpdate,
	},
	isPglite: true,
}))

// Mock Better Auth module to prevent initialization
// Auth is mocked because we want to test procedures, not auth itself
mock.module("./auth", () => ({
	auth: {
		api: {
			getSession: mock(() =>
				Promise.resolve({
					session: null,
					user: null,
				}),
			),
		},
	},
}))
