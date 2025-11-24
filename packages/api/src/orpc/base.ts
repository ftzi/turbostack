import "server-only"
import { getLogger } from "@orpc/experimental-pino"
import { implement } from "@orpc/server"
import type { Logger } from "pino"
import { contract } from "./contract/index"

/**
 * Base context type with headers and lazy-loaded logger
 * Reference: https://orpc.unnoq.com/docs/middleware
 */
export type BaseContext = {
	headers: Headers
	logger?: Logger
}

/**
 * Base implementer with initial headers context
 */
const baseImplementer = implement(contract).$context<{ headers: Headers }>()

/**
 * Logger middleware - adds lazy-loaded logger to context
 * Logger is injected at runtime by LoggingHandlerPlugin
 */
const loggerMiddleware = baseImplementer.middleware(({ context, next }) => {
	let cachedLogger: Logger | undefined

	return next({
		context: {
			...context,
			get logger() {
				cachedLogger ??= getLogger(context as never)
				return cachedLogger
			},
		},
	})
})

/**
 * Public procedure implementer with logger middleware applied
 * All procedures have access to context.logger
 */
export const publicProcedure = baseImplementer.use(loggerMiddleware)
