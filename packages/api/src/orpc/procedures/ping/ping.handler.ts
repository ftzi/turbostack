import "server-only"
import { os } from "../../base.js"

/**
 * Public ping procedure
 * Returns a simple message with timestamp
 */
export const ping = os.ping.handler(({ context }) => {
	context.logger?.info("Ping request received")

	return {
		message: "pong",
		timestamp: Date.now(),
	}
})
