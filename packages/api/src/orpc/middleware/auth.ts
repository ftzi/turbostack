import "server-only"
import { implement, ORPCError } from "@orpc/server"
import { auth, type Session, type User } from "../../auth.js"
import { os } from "../base.js"
import { contract } from "../contract/index.js"

/**
 * Better Auth middleware for oRPC
 * Reference: https://www.better-auth.com/docs/guides/optimizing-for-performance#ssr-optimizations
 * Reference: https://orpc.unnoq.com/docs/middleware
 *
 * Note: Middleware uses ORPCError to throw errors defined in commonErrors (errors.ts)
 * The UNAUTHORIZED error is defined in commonErrors and thrown here using ORPCError API
 */
const authMiddleware = implement(contract)
	.$context<{ headers: Headers }>()
	.middleware(async ({ context, next }) => {
		const sessionData = await auth.api.getSession({
			headers: context.headers,
		})

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (!sessionData?.session || !sessionData.user) {
			// Throws UNAUTHORIZED error (defined in commonErrors)
			throw new ORPCError("UNAUTHORIZED", {
				message: "You must be logged in to access this resource",
			})
		}

		return next({
			context: {
				session: sessionData.session,
				user: sessionData.user,
			},
		})
	})

/**
 * Implementer with logger + auth middlewares chained
 * Guarantees that context.logger, context.session, and context.user are defined
 */
export const authorized = os.use(authMiddleware)

/**
 * Type helpers for authenticated context
 */
export type AuthenticatedContext = {
	session: Session
	user: User
}
