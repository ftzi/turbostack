import "server-only"
import { publicProcedure } from "../../base"

/**
 * Public ping procedure
 * Returns a simple message with timestamp
 */
export const ping = publicProcedure.ping.handler(({ context }) => {
	context.logger?.info("Ping request received")

	return {
		message: "pong",
		timestamp: Date.now(),
	}
})
