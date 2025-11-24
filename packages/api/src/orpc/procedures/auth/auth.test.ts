import { beforeEach, describe, expect, test } from "bun:test"
import { call } from "@orpc/server"
import { auth } from "../../../auth"
import { callAuthenticated, expectORPCError, type MockAuth } from "../../../test-utils/helpers"
import { authPing } from "./auth.handler"

// Reference to mocked auth module
const mockAuth = auth as never as MockAuth

describe("authPing handler", () => {
	beforeEach(() => {
		mockAuth.api.getSession.mockClear()
	})

	test("should return pong message with timestamp and user ID when authenticated", async () => {
		const result = await callAuthenticated(authPing, {}, mockAuth)

		expect(result).toEqual({
			message: "pong",
			timestamp: expect.any(Number),
			userId: "test-user-123",
		})
	})

	test("should include correct user ID from authenticated context", async () => {
		const result = await callAuthenticated(authPing, {}, mockAuth, {
			userId: "custom-user-456",
		})

		expect(result.userId).toBe("custom-user-456")
	})

	test("should return timestamp close to current time", async () => {
		const beforeTime = Date.now()
		const result = await callAuthenticated(authPing, {}, mockAuth)
		const afterTime = Date.now()

		expect(result.timestamp).toBeGreaterThanOrEqual(beforeTime)
		expect(result.timestamp).toBeLessThanOrEqual(afterTime)
	})

	test("should throw UNAUTHORIZED error when not authenticated", async () => {
		mockAuth.api.getSession.mockResolvedValueOnce({
			session: null,
			user: null,
		})

		await expectORPCError(
			() => call(authPing, {}, { context: { headers: new Headers() } }),
			"unauthorized",
			"You must be logged in",
		)
	})
})
