import "server-only";
import { authPing, ping } from "./procedures/auth";
import { getCurrentUser, updateUser } from "./procedures/user";

/**
 * Main oRPC router
 * Organizes all procedures in a nested structure matching the contract
 */
export const router = {
	ping,
	auth: {
		ping: authPing,
		getCurrentUser,
		updateUser,
	},
};

export type Router = typeof router;
