import { mock } from "bun:test"

// Mock server-only to prevent errors in test environment
mock.module("server-only", () => ({}))

// Mock server environment variables to prevent validation errors
mock.module("@workspace/server/env", () => ({
	serverEnv: {
		DATABASE_URL: "postgresql://test:test@localhost:5432/test",
		BETTER_AUTH_SECRET: "test-secret",
		BETTER_AUTH_URL: "http://localhost:3000",
		GOOGLE_CLIENT_ID: "test-client-id",
		GOOGLE_CLIENT_SECRET: "test-client-secret",
		RESEND_API_KEY: "test-resend-key",
	},
}))

// Mock Better Auth module to prevent initialization
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

// Create reusable mocks for database
const mockFindFirst = mock(() => Promise.resolve(null))
const mockFindMany = mock(() => Promise.resolve([]))
const mockReturning = mock(() => Promise.resolve([]))
const mockWhere = mock(() => ({ returning: mockReturning }))
const mockSet = mock(() => ({ where: mockWhere }))
const mockUpdate = mock(() => ({ set: mockSet }))

// Mock database module to prevent initialization during import
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
}))
