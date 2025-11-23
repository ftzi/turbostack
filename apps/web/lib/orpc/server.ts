import "server-only";
import { createRouterClient } from "@orpc/server";
import { headers } from "next/headers";
import { router } from "@/server/orpc/router";

/**
 * Server-side oRPC client
 * Calls procedures directly without HTTP overhead
 * Only available in server components and API routes
 */
export const serverClient = createRouterClient(router, {
	context: async () => ({
		headers: await headers(),
	}),
});
