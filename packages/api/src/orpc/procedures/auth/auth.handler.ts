import "server-only"
import { authorized } from "../../middleware/auth.js"

/**
 * Authenticated ping procedure
 * Returns message with timestamp and user ID
 * Requires authentication
 */
export const authPing = authorized.auth.ping.handler(({ context }) => {
	return {
		message: "pong",
		timestamp: Date.now(),
		userId: context.user.id,
	}
})
