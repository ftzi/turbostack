import { z } from "zod"
import { baseContract } from "../../errors"

/**
 * Schema for listing all users
 */
const listUsersInputSchema = z.object({})

const userWithRoleSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.email(),
	role: z.string(),
	image: z.url().nullable(),
	createdAt: z.date(),
})

const listUsersOutputSchema = z.array(userWithRoleSchema)

/**
 * Schema for updating a user's role
 */
const updateUserRoleInputSchema = z.object({
	userId: z.string(),
	role: z.enum(["user", "admin"]),
})

const updateUserRoleOutputSchema = userWithRoleSchema

/**
 * Admin management contracts
 */
export const adminContract = {
	listUsers: baseContract.input(listUsersInputSchema).output(listUsersOutputSchema),
	updateUserRole: baseContract.input(updateUserRoleInputSchema).output(updateUserRoleOutputSchema),
}
