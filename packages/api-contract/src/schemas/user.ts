import { z } from "zod"

/**
 * Schema for getting current user information
 */
export const getCurrentUserInputSchema = z.object({})

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.email(),
	image: z.url().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const getCurrentUserOutputSchema = userSchema.nullable()

/**
 * Schema for updating user profile
 */
export const updateUserInputSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	image: z.url().nullable().optional(),
})

export const updateUserOutputSchema = userSchema
