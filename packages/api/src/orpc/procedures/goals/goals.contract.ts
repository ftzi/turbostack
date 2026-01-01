import { createGoalSchema, updateGoalSchema } from "@workspace/shared/validations/goals"
import { z } from "zod"
import { baseContract } from "../../errors"

// Goal output schema (matches database select type)
const goalSchema = z.object({
	id: z.string().uuid(),
	title: z.string(),
	description: z.string().nullable(),
	userId: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

const goalsArraySchema = z.array(goalSchema)

const updateGoalInputSchema = z.object({
	id: z.string().uuid(),
	data: updateGoalSchema,
})

const deleteGoalInputSchema = z.object({
	id: z.string().uuid(),
})

/**
 * Goals management contracts
 */
export const goalsContract = {
	// Get all goals for authenticated user
	getAll: baseContract.input(z.object({})).output(goalsArraySchema),

	// Create new goal
	create: baseContract.input(createGoalSchema).output(goalSchema),

	// Update existing goal
	update: baseContract.input(updateGoalInputSchema).output(goalSchema),

	// Delete goal
	delete: baseContract.input(deleteGoalInputSchema).output(z.void()),
}
