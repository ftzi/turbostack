import "server-only";
import { ORPCError } from "@orpc/server";
import { auth, type Session, type User } from "@/lib/auth";
import { base } from "../base";

/**
 * Better Auth middleware for oRPC
 * Validates the session and adds user/session to context
 * Throws UNAUTHORIZED error if session is invalid
 */
export const authMiddleware = base.middleware(async ({ context, next }) => {
	const sessionData = await auth.api.getSession({
		headers: context.headers,
	});

	if (!sessionData?.session || !sessionData?.user) {
		throw new ORPCError("UNAUTHORIZED", {
			message: "You must be logged in to access this resource",
		});
	}

	return next({
		context: {
			session: sessionData.session,
			user: sessionData.user,
		},
	});
});

/**
 * Authorized base with authentication
 * Use this for procedures that require authentication
 * Guarantees that context.session and context.user are defined
 */
export const authorized = base.use(authMiddleware);

/**
 * Type helpers for authenticated context
 */
export interface AuthenticatedContext {
	session: Session;
	user: User;
}
