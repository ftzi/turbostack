import { z } from "zod"
import { baseContract } from "../../errors"

/**
 * Schema for getting current user information
 */
const getCurrentUserInputSchema = z.object({})

const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.email(),
	image: z.url().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

const getCurrentUserOutputSchema = userSchema.nullable()

/**
 * Schema for updating user profile
 */
const updateUserInputSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	image: z.url().nullable().optional(),
})

const updateUserOutputSchema = userSchema

/**
 * User management contracts
 */
export const userContract = {
	getCurrentUser: baseContract.input(getCurrentUserInputSchema).output(getCurrentUserOutputSchema),
	updateUser: baseContract.input(updateUserInputSchema).output(updateUserOutputSchema),
}
