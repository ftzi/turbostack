import { beforeEach, describe, expect, test } from "bun:test"
import { call } from "@orpc/server"
import { db } from "@workspace/server/db"
import { auth } from "../../../auth"
import { createMockUser } from "../../../test-utils/fixtures"
import { callAuthenticated, expectORPCError, type MockAuth } from "../../../test-utils/helpers"
import { getCurrentUser, updateUser } from "./user.handler"

// Reference to mocked auth module
const mockAuth = auth as never as MockAuth

// Reference to mocked db module
type MockFunction = {
	mockClear: () => void
	mockResolvedValueOnce: (value: unknown) => void
}

const mockDb = db as never as {
	query: {
		users: {
			findFirst: MockFunction
		}
	}
	update: () => {
		set: () => {
			where: () => {
				returning: MockFunction
			}
		}
	}
}

describe("getCurrentUser handler", () => {
	beforeEach(() => {
		mockDb.query.users.findFirst.mockClear()
		mockAuth.api.getSession.mockClear()
	})

	test("should return user data when user exists", async () => {
		const mockUser = createMockUser()
		mockDb.query.users.findFirst.mockResolvedValueOnce(mockUser)

		const result = await callAuthenticated(getCurrentUser, {}, mockAuth)

		expect(result).toEqual({
			id: mockUser.id,
			name: mockUser.name,
			email: mockUser.email,
			image: mockUser.image,
			createdAt: mockUser.createdAt,
			updatedAt: mockUser.updatedAt,
		})
		expect(mockDb.query.users.findFirst).toHaveBeenCalledTimes(1)
	})

	test("should return null when user not found in database", async () => {
		mockDb.query.users.findFirst.mockResolvedValueOnce(null)

		const result = await callAuthenticated(getCurrentUser, {}, mockAuth)

		expect(result).toBeNull()
		expect(mockDb.query.users.findFirst).toHaveBeenCalledTimes(1)
	})

	test("should query database with correct user ID from context", async () => {
		const mockUser = createMockUser()
		mockDb.query.users.findFirst.mockResolvedValueOnce(mockUser)

		await callAuthenticated(getCurrentUser, {}, mockAuth)

		expect(mockDb.query.users.findFirst).toHaveBeenCalledWith({
			where: expect.any(Object),
		})
	})

	test("should throw UNAUTHORIZED error when not authenticated", async () => {
		mockAuth.api.getSession.mockResolvedValueOnce({
			session: null,
			user: null,
		})

		await expectORPCError(
			() => call(getCurrentUser, {}, { context: { headers: new Headers() } }),
			"unauthorized",
			"You must be logged in",
		)
	})
})

describe("updateUser handler", () => {
	beforeEach(() => {
		mockDb.update().set().where().returning.mockClear()
		mockAuth.api.getSession.mockClear()
	})

	test("should update user name successfully", async () => {
		const updatedUser = createMockUser({ name: "Updated Name" })
		mockDb.update().set().where().returning.mockResolvedValueOnce([updatedUser])

		const result = await callAuthenticated(updateUser, { name: "Updated Name" }, mockAuth)

		expect(result).toEqual({
			id: updatedUser.id,
			name: "Updated Name",
			email: updatedUser.email,
			image: updatedUser.image,
			createdAt: updatedUser.createdAt,
			updatedAt: updatedUser.updatedAt,
		})
	})

	test("should update user image successfully", async () => {
		const updatedUser = createMockUser({ image: "https://example.com/new-avatar.jpg" })
		mockDb.update().set().where().returning.mockResolvedValueOnce([updatedUser])

		const result = await callAuthenticated(updateUser, { image: "https://example.com/new-avatar.jpg" }, mockAuth)

		expect(result.image).toBe("https://example.com/new-avatar.jpg")
	})

	test("should update both name and image", async () => {
		const updatedUser = createMockUser({
			name: "Updated Name",
			image: "https://example.com/new-avatar.jpg",
		})
		mockDb.update().set().where().returning.mockResolvedValueOnce([updatedUser])

		const result = await callAuthenticated(
			updateUser,
			{
				name: "Updated Name",
				image: "https://example.com/new-avatar.jpg",
			},
			mockAuth,
		)

		expect(result.name).toBe("Updated Name")
		expect(result.image).toBe("https://example.com/new-avatar.jpg")
	})

	test("should allow setting image to null", async () => {
		const updatedUser = createMockUser({ image: null })
		mockDb.update().set().where().returning.mockResolvedValueOnce([updatedUser])

		const result = await callAuthenticated(updateUser, { image: null }, mockAuth)

		expect(result.image).toBeNull()
	})

	test("should throw OPERATION_FAILED when database update returns empty array", async () => {
		mockDb.update().set().where().returning.mockResolvedValueOnce([])

		await expectORPCError(
			() => callAuthenticated(updateUser, { name: "New Name" }, mockAuth),
			"operationFailed",
			"Failed to update user profile",
		)
	})

	test("should throw UNAUTHORIZED error when not authenticated", async () => {
		mockAuth.api.getSession.mockResolvedValueOnce({
			session: null,
			user: null,
		})

		await expectORPCError(
			() => call(updateUser, { name: "New Name" }, { context: { headers: new Headers() } }),
			"unauthorized",
			"You must be logged in",
		)
	})
})
