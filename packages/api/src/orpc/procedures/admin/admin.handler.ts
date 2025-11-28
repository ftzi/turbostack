import "server-only"
import { db } from "@workspace/server/db"
import { users } from "@workspace/server/db/schema"
import { eq } from "drizzle-orm"
import { adminProcedure } from "../../middleware/auth"

/**
 * List all users in the system
 * Only accessible by administrators
 */
export const listUsers = adminProcedure.admin.listUsers.handler(async () => {
	const allUsers = await db.query.users.findMany({
		orderBy: (u, { desc }) => [desc(u.createdAt)],
	})

	return allUsers.map((user) => ({
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
		image: user.image,
		createdAt: user.createdAt,
	}))
})

/**
 * Update a user's role
 * Only accessible by administrators
 */
export const updateUserRole = adminProcedure.admin.updateUserRole.handler(async ({ input, errors }) => {
	const [updatedUser] = await db
		.update(users)
		.set({
			role: input.role,
			updatedAt: new Date(),
		})
		.where(eq(users.id, input.userId))
		.returning()

	if (!updatedUser) {
		throw errors.operationFailed({
			data: { message: "User not found" },
		})
	}

	return {
		id: updatedUser.id,
		name: updatedUser.name,
		email: updatedUser.email,
		role: updatedUser.role,
		image: updatedUser.image,
		createdAt: updatedUser.createdAt,
	}
})
