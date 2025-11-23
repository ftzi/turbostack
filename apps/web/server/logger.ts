import pino from "pino"

/**
 * Global Pino logger instance
 * Configured with pino-pretty for development and JSON for production
 *
 * Usage:
 * - In server code: import { logger } from "@/server/logger"
 * - In oRPC procedures: Access via context.logger
 *
 * Development: Run with `bun dev | bunx pino-pretty` for formatted logs
 */
export const logger = pino({
	level: process.env.NODE_ENV === "production" ? "info" : "debug",
	...(process.env.NODE_ENV !== "production" && {
		transport: {
			target: "pino-pretty",
			options: {
				colorize: true,
				translateTime: "SYS:standard",
				ignore: "pid,hostname",
			},
		},
	}),
})
