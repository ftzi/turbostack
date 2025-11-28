import type { mock } from "bun:test"
import type { AnyProcedure } from "@orpc/server"
import { call } from "@orpc/server"
import { createMockSessionData } from "./fixtures"

/**
 * Type for mocked Better Auth instance
 */
export type MockAuth = {
	api: {
		getSession: ReturnType<typeof mock>
	}
}

/**
 * Helper to call an authenticated procedure with a mocked session
 * Automatically sets up the auth mock and cleans up after
 *
 * @example
 * const result = await callAuthenticated(authPing, {}, mockAuth)
 */
// biome-ignore lint/nursery/useMaxParams: Test utility - readability is more important than parameter count
export async function callAuthenticated<T extends AnyProcedure>(
	procedure: T,
	input: unknown,
	mockAuth: MockAuth,
	options?: {
		userId?: string
		userEmail?: string
		role?: string
	},
) {
	const sessionData = createMockSessionData(
		options?.userId || options?.userEmail || options?.role
			? {
					id: options.userId,
					email: options.userEmail,
					role: options.role,
				}
			: undefined,
	)

	mockAuth.api.getSession.mockResolvedValueOnce(sessionData)

	return await call(procedure, input, { context: { headers: new Headers() } })
}

/**
 * Helper to call an admin procedure with a mocked admin session
 * Automatically sets up the auth mock with role="admin"
 *
 * @example
 * const result = await callAsAdmin(listUsers, {}, mockAuth)
 */
// biome-ignore lint/nursery/useMaxParams: Test utility - matches callAuthenticated signature
export function callAsAdmin<T extends AnyProcedure>(
	procedure: T,
	input: unknown,
	mockAuth: MockAuth,
	options?: {
		userId?: string
		userEmail?: string
	},
) {
	return callAuthenticated(procedure, input, mockAuth, {
		...options,
		role: "admin",
	})
}

/**
 * Helper to expect an oRPC error with specific code and optional message
 * Message can be in the error.message or error.data.message field
 *
 * @example
 * await expectORPCError(
 *   () => call(procedure, input, { context }),
 *   'operationFailed',
 *   'Failed to update user profile'
 * )
 */
// biome-ignore lint/nursery/useMaxParams: Test utility - 3 params provides clear API
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Error validation logic is straightforward
export async function expectORPCError(fn: () => Promise<unknown>, code: string, message?: string) {
	try {
		await fn()
		throw new Error("Expected function to throw an error, but it did not")
	} catch (error) {
		if (error instanceof Error && "code" in error) {
			const orpcError = error as { code: string; message: string; data?: { message?: string } }
			if (orpcError.code !== code) {
				throw new Error(`Expected error code '${code}', but got '${orpcError.code}'`)
			}
			if (message) {
				const errorMessage = orpcError.data?.message || orpcError.message
				if (!errorMessage.includes(message)) {
					throw new Error(`Expected error message to include '${message}', but got '${errorMessage}'`)
				}
			}
		} else {
			throw new Error(`Expected an ORPCError with code '${code}', but got: ${error}`)
		}
	}
}
