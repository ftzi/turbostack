import "server-only"
import { os } from "./base.js"
import { authPing } from "./procedures/auth/auth.handler.js"
import { ping } from "./procedures/ping/ping.handler.js"
import { getCurrentUser, updateUser } from "./procedures/user/user.handler.js"

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
