import { RPCLink } from "@orpc/client/fetch";
import type { Router } from "@/server/orpc/router";

/**
 * Type-safe oRPC client
 * Works in both browser and server environments
 */
export const client = new RPCLink<Router>({
	url:
		typeof window !== "undefined"
			? `${window.location.origin}/api/rpc`
			: `http://localhost:3000/api/rpc`,
	headers: async () => {
		if (typeof window !== "undefined") {
			return {};
		}

		const { headers } = await import("next/headers");
		return Object.fromEntries(await headers());
	},
});
