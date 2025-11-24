import "server-only";
import { os } from "../base.js";
import { authorized } from "../middleware/auth.js";

/**
 * Public ping procedure
 * Returns a simple message with timestamp
 */
export const ping = os.ping.handler(({ context }) => {
	context.logger?.info("Ping request received");

	return {
		message: "pong",
		timestamp: Date.now(),
	};
});

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
	};
});
