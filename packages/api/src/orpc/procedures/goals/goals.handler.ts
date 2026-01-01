import "server-only"
import { db } from "@workspace/server/db"
import { goals } from "@workspace/server/db/schema"
import { eq } from "drizzle-orm"
import { protectedProcedure } from "../../middleware/auth"

/**
 * Get all goals for the authenticated user
 */
export const getAll = protectedProcedure.goals.getAll.handler(async ({ context }) =>
	db.select().from(goals).where(eq(goals.userId, context.user.id)),
)

/**
 * Create a new goal
 */
export const create = protectedProcedure.goals.create.handler(async ({ input, context, errors }) => {
	const [goal] = await db
		.insert(goals)
		.values({
			title: input.title,
			description: input.description,
			userId: context.user.id,
		})
		.returning()

	if (!goal) {
		throw errors.operationFailed({
			data: { message: "Failed to create goal" },
		})
	}

	return goal
})

/**
 * Update an existing goal
 */
export const update = protectedProcedure.goals.update.handler(async ({ input, errors }) => {
	const [goal] = await db
		.update(goals)
		.set({
			...input.data,
			updatedAt: new Date(),
		})
		.where(eq(goals.id, input.id))
		.returning()

	if (!goal) {
		throw errors.operationFailed({
			data: { message: "Goal not found" },
		})
	}

	return goal
})

/**
 * Delete a goal
 */
export const deleteGoal = protectedProcedure.goals.delete.handler(async ({ input }) => {
	await db.delete(goals).where(eq(goals.id, input.id))
})
