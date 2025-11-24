import "server-only"
import { protectedProcedure } from "../../middleware/auth"

/**
 * Authenticated ping procedure
 * Returns message with timestamp and user ID
 * Requires authentication
 */
export const authPing = protectedProcedure.auth.ping.handler(({ context }) => ({
	message: "pong",
	timestamp: Date.now(),
	userId: context.user.id,
}))
