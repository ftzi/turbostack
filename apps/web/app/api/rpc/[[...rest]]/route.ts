import { CompressionPlugin, RPCHandler } from "@orpc/server/fetch";
import { headers } from "next/headers";
import { router } from "@/server/orpc/router";

/**
 * oRPC handler for Next.js App Router
 * Handles all HTTP methods and includes compression for better performance
 */
const handler = new RPCHandler(router, {
	plugins: [new CompressionPlugin()],
});

/**
 * Main request handler
 * Injects headers into context for Better Auth session validation
 */
async function handleRequest(request: Request) {
	const requestHeaders = await headers();

	const { response } = await handler.handle(request, {
		prefix: "/api/rpc",
		context: {
			headers: requestHeaders,
		},
	});

	return response ?? new Response("Not found", { status: 404 });
}

export const HEAD = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
