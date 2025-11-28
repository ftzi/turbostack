import "server-only"
import { publicProcedure } from "./base"
import { listUsers, updateUserRole } from "./procedures/admin/admin.handler"
import { authPing } from "./procedures/auth/auth.handler"
import { ping } from "./procedures/ping/ping.handler"
import { getCurrentUser, updateUser } from "./procedures/user/user.handler"

/**
 * Main oRPC router
 * Uses .router() method to enforce the contract at runtime
 * This ensures type-checking and runtime validation of the entire API
 */
export const router = publicProcedure.router({
	ping,
	auth: {
		ping: authPing,
		getCurrentUser,
		updateUser,
	},
	admin: {
		listUsers,
		updateUserRole,
	},
})

export type Router = typeof router
