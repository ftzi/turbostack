"use client"

import { RPCLink } from "@orpc/client/fetch"
import { createTanstackQueryUtils } from "@orpc/tanstack-query"
import { QueryClient } from "@tanstack/react-query"
import type { Router } from "@/server/orpc/router"

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
 * Type-safe oRPC client
 * Reference: https://orpc.unnoq.com/docs/client/rpc-link
 */
export const client = new RPCLink<Router>({
	url: typeof window !== "undefined" ? `${window.location.origin}/api/rpc` : `http://localhost:3000/api/rpc`,
	headers: async () => {
		if (typeof window !== "undefined") {
			return {}
		}

		const { headers } = await import("next/headers")
		return Object.fromEntries(await headers())
	},
})

/**
 * oRPC TanStack Query Integration
 * Reference: https://orpc.unnoq.com/docs/integrations/tanstack-query
 */
// @ts-expect-error - RPCLink<Router> works at runtime but doesn't satisfy NestedClient constraint
export const orpc = createTanstackQueryUtils(client)
