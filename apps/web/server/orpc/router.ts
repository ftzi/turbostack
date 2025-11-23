import "server-only"
import { os } from "./base"
import { authPing, ping } from "./procedures/auth"
import { getCurrentUser, updateUser } from "./procedures/user"

/**
 * Main oRPC router
 * Uses .router() method to enforce the contract at runtime
 * This ensures type-checking and runtime validation of the entire API
 */
export const router = os.router({
	ping,
	auth: {
		ping: authPing,
		getCurrentUser,
		updateUser,
	},
})

export type Router = typeof router
