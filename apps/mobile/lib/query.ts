import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import type { RouterClient } from "@orpc/server"
import { createTanstackQueryUtils } from "@orpc/tanstack-query"
import { QueryClient } from "@tanstack/react-query"
import type { Router } from "@workspace/api/orpc/router"

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"

const link = new RPCLink({
	url: `${API_URL}/api/rpc`,
})

export const client: RouterClient<Router> = createORPCClient(link)
export const orpc = createTanstackQueryUtils(client)

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
