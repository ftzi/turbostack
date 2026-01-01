// Reference: https://orpc.dev/docs/integrations/better-auth
// Reference: https://www.better-auth.com/docs/integrations/expo#making-authenticated-requests-to-your-server
import { createORPCClient } from "@orpc/client"
import { RPCLink } from "@orpc/client/fetch"
import type { RouterClient } from "@orpc/server"
import { createTanstackQueryUtils } from "@orpc/tanstack-query"
import { QueryClient } from "@tanstack/react-query"
import type { Router } from "@workspace/api/orpc/router"
import { authClient } from "./auth-client"

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"

/**
 * oRPC link with Better Auth integration
 * Automatically includes session cookies in request headers
 */
const link = new RPCLink({
	url: `${API_URL}/api/rpc`,
	headers: () => {
		const cookies = authClient.getCookie()
		return cookies ? { Cookie: cookies } : {}
	},
	fetch: (input, init) => {
		return fetch(input, {
			...init,
			// 'include' can interfere with cookies we set manually in headers
			credentials: "omit",
		})
	},
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
