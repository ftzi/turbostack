import "server-only"
import { implement } from "@orpc/server"
import { auth, type Session, type User } from "../../auth"
import { publicProcedure } from "../base"
import { contract } from "../contract/index"

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
	.middleware(async ({ context, next, errors }) => {
		const sessionData = await auth.api.getSession({
			headers: context.headers,
		})

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (!(sessionData?.session && sessionData.user)) {
			// Throws unauthorized error (defined in commonErrors)
			throw errors.unauthorized({
				data: {
					message: "You must be logged in to access this resource",
				},
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
 * Protected procedure implementer with logger + auth middlewares chained
 * Guarantees that context.logger, context.session, and context.user are defined
 */
export const protectedProcedure = publicProcedure.use(authMiddleware)

/**
 * Admin middleware for oRPC
 * Checks that the authenticated user has the "admin" role
 */
const adminMiddleware = implement(contract)
	.$context<{ user: User }>()
	.middleware(({ context, next, errors }) => {
		if (context.user.role !== "admin") {
			throw errors.unauthorized({
				data: {
					message: "Admin access required",
				},
			})
		}

		return next({ context })
	})

/**
 * Admin procedure implementer with auth + admin middlewares chained
 * Guarantees that context.user has role "admin"
 */
export const adminProcedure = protectedProcedure.use(adminMiddleware)

/**
 * Type helpers for authenticated context
 */
export type AuthenticatedContext = {
	session: Session
	user: User
}
