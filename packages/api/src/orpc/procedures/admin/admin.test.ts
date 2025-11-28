import { beforeEach, describe, expect, test } from "bun:test"
import { call } from "@orpc/server"
import { db } from "@workspace/server/db"
import { auth } from "../../../auth"
import { createMockUser } from "../../../test-utils/fixtures"
import { callAsAdmin, callAuthenticated, expectORPCError, type MockAuth } from "../../../test-utils/helpers"
import { listUsers, updateUserRole } from "./admin.handler"

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
			findMany: MockFunction
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

describe("listUsers handler", () => {
	beforeEach(() => {
		mockDb.query.users.findMany.mockClear()
		mockAuth.api.getSession.mockClear()
	})

	test("should return all users when called by admin", async () => {
		const mockUsers = [
			createMockUser({ id: "user-1", name: "User One", role: "user" }),
			createMockUser({ id: "user-2", name: "User Two", role: "admin" }),
		]
		mockDb.query.users.findMany.mockResolvedValueOnce(mockUsers)

		const result = await callAsAdmin(listUsers, {}, mockAuth)

		expect(result).toHaveLength(2)
		expect(result[0]).toEqual({
			id: "user-1",
			name: "User One",
			email: mockUsers[0].email,
			role: "user",
			image: mockUsers[0].image,
			createdAt: mockUsers[0].createdAt,
		})
		expect(mockDb.query.users.findMany).toHaveBeenCalledTimes(1)
	})

	test("should return empty array when no users exist", async () => {
		mockDb.query.users.findMany.mockResolvedValueOnce([])

		const result = await callAsAdmin(listUsers, {}, mockAuth)

		expect(result).toEqual([])
	})

	test("should throw UNAUTHORIZED error when called by non-admin user", async () => {
		await expectORPCError(
			() => callAuthenticated(listUsers, {}, mockAuth, { role: "user" }),
			"unauthorized",
			"Admin access required",
		)
	})

	test("should throw UNAUTHORIZED error when not authenticated", async () => {
		mockAuth.api.getSession.mockResolvedValueOnce({
			session: null,
			user: null,
		})

		await expectORPCError(
			() => call(listUsers, {}, { context: { headers: new Headers() } }),
			"unauthorized",
			"You must be logged in",
		)
	})
})

describe("updateUserRole handler", () => {
	beforeEach(() => {
		mockDb.update().set().where().returning.mockClear()
		mockAuth.api.getSession.mockClear()
	})

	test("should update user role to admin successfully", async () => {
		const updatedUser = createMockUser({ id: "target-user", role: "admin" })
		mockDb.update().set().where().returning.mockResolvedValueOnce([updatedUser])

		const result = await callAsAdmin(updateUserRole, { userId: "target-user", role: "admin" }, mockAuth)

		expect(result.role).toBe("admin")
		expect(result.id).toBe("target-user")
	})

	test("should update user role to user successfully", async () => {
		const updatedUser = createMockUser({ id: "target-user", role: "user" })
		mockDb.update().set().where().returning.mockResolvedValueOnce([updatedUser])

		const result = await callAsAdmin(updateUserRole, { userId: "target-user", role: "user" }, mockAuth)

		expect(result.role).toBe("user")
	})

	test("should throw OPERATION_FAILED when user not found", async () => {
		mockDb.update().set().where().returning.mockResolvedValueOnce([])

		await expectORPCError(
			() => callAsAdmin(updateUserRole, { userId: "non-existent", role: "admin" }, mockAuth),
			"operationFailed",
			"User not found",
		)
	})

	test("should throw UNAUTHORIZED error when called by non-admin user", async () => {
		await expectORPCError(
			() => callAuthenticated(updateUserRole, { userId: "target", role: "admin" }, mockAuth, { role: "user" }),
			"unauthorized",
			"Admin access required",
		)
	})

	test("should throw UNAUTHORIZED error when not authenticated", async () => {
		mockAuth.api.getSession.mockResolvedValueOnce({
			session: null,
			user: null,
		})

		await expectORPCError(
			() => call(updateUserRole, { userId: "target", role: "admin" }, { context: { headers: new Headers() } }),
			"unauthorized",
			"You must be logged in",
		)
	})
})
