import "server-only"
import { eq } from "drizzle-orm"
import { db } from "../../../db/index"
import { user } from "../../../db/schema"
import { authorized } from "../../middleware/auth"

/**
 * Get current user information
 * Returns the authenticated user's data from the database
 */
export const getCurrentUser = authorized.auth.getCurrentUser.handler(async ({ context }) => {
	const userData = await db.query.user.findFirst({
		where: eq(user.id, context.user.id),
	})

	if (!userData) {
		return null
	}

	return {
		id: userData.id,
		name: userData.name,
		email: userData.email,
		image: userData.image,
		createdAt: userData.createdAt,
		updatedAt: userData.updatedAt,
	}
})

/**
 * Update user profile
 * Allows authenticated users to update their name and image
 *
 * Reference: https://orpc.unnoq.com/docs/error-handling
 * Uses generic OPERATION_FAILED error for consistent error handling
 */
export const updateUser = authorized.auth.updateUser.handler(async ({ context, input, errors }) => {
	const updateData: {
		name?: string
		image?: string | null
		updatedAt: Date
	} = {
		updatedAt: new Date(),
	}

	if (input.name !== undefined) {
		updateData.name = input.name
	}

	if (input.image !== undefined) {
		updateData.image = input.image
	}

	const [updatedUser] = await db.update(user).set(updateData).where(eq(user.id, context.user.id)).returning()

	if (!updatedUser) {
		throw errors.OPERATION_FAILED({
			data: { message: "Failed to update user profile" },
		})
	}

	return {
		id: updatedUser.id,
		name: updatedUser.name,
		email: updatedUser.email,
		image: updatedUser.image,
		createdAt: updatedUser.createdAt,
		updatedAt: updatedUser.updatedAt,
	}
})
