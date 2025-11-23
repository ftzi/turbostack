import "server-only";
import { os } from "@orpc/server";

/**
 * Base context type that includes request headers
 * Headers are required for Better Auth session validation
 */
export interface BaseContext {
	headers: Headers;
}

/**
 * Base oRPC setup with context
 * All procedures and middleware should extend from this base
 */
export const base = os.$context<BaseContext>();
