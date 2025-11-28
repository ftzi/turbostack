"use client"

import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import type { RouterClient } from "@orpc/server"
import { createTanstackQueryUtils } from "@orpc/tanstack-query"
import { QueryClient } from "@tanstack/react-query"
import type { Router } from "@workspace/api/orpc/router"

/**
 * Query Client configuration for TanStack Query
 * Reference: https://tanstack.com/query/latest/docs/framework/react/guides/query-client
 */
export function createQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
				retry: 1,
			},
		},
	})
}

/**
 * Type-safe oRPC link
 * Reference: https://orpc.unnoq.com/docs/client/rpc-link
 */
const link = new RPCLink({
	url: typeof window !== "undefined" ? `${window.location.origin}/api/rpc` : "http://localhost:3000/api/rpc",
	headers: async () => {
		if (typeof window !== "undefined") {
			return {}
		}

		const { headers } = await import("next/headers")
		return Object.fromEntries(await headers())
	},
})

/**
 * Type-safe oRPC client
 * Reference: https://orpc.unnoq.com/docs/client/rpc-link
 */
export const client: RouterClient<Router> = createORPCClient(link)

/**
 * oRPC TanStack Query Integration
 * Reference: https://orpc.unnoq.com/docs/integrations/tanstack-query
 */
export const orpc = createTanstackQueryUtils(client)
