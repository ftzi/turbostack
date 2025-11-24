import "server-only"
import { createRouterClient } from "@orpc/server"
import { router } from "./router.js"

/**
 * Server-side oRPC client
 * Calls procedures directly without HTTP overhead
 * Only available in server components and API routes
 */
export function createServerClient(headers: Promise<Headers> | Headers) {
	return createRouterClient(router, {
		context: async () => ({
			headers: headers instanceof Promise ? await headers : headers,
		}),
	})
}
