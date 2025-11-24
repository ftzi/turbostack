import { LoggingHandlerPlugin } from "@orpc/experimental-pino"
import { CompressionPlugin, RPCHandler } from "@orpc/server/fetch"
import { logger } from "@workspace/api/logger"
import { router } from "@workspace/api/orpc/router"
import { headers } from "next/headers"

/**
 * oRPC handler for Next.js App Router
 * Includes compression and structured logging with Pino
 */
const handler = new RPCHandler(router, {
	plugins: [
		new CompressionPlugin(),
		new LoggingHandlerPlugin({
			logger,
			generateId: () => crypto.randomUUID(),
			logRequestResponse: true,
			logRequestAbort: true,
		}),
	],
})

/**
 * Main request handler
 * Injects headers into context for Better Auth session validation
 */
async function handleRequest(request: Request) {
	const requestHeaders = await headers()

	const { response } = await handler.handle(request, {
		prefix: "/api/rpc",
		context: {
			headers: requestHeaders,
		},
	})

	return response ?? new Response("Not found", { status: 404 })
}

export const HEAD = handleRequest
export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest
