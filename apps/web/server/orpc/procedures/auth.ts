import "server-only";
import {
	authPingInputSchema,
	authPingOutputSchema,
	pingInputSchema,
	pingOutputSchema,
} from "@workspace/api-contract";
import { base } from "../base";
import { authorized } from "../middleware/auth";

/**
 * Public ping procedure
 * Returns a simple message with timestamp
 */
export const ping = base
	.input(pingInputSchema)
	.output(pingOutputSchema)
	.handler(async () => {
		return {
			message: "pong",
			timestamp: Date.now(),
		};
	});

/**
 * Authenticated ping procedure
 * Returns message with timestamp and user ID
 * Requires authentication
 */
export const authPing = authorized
	.input(authPingInputSchema)
	.output(authPingOutputSchema)
	.handler(async ({ context }) => {
		return {
			message: "pong",
			timestamp: Date.now(),
			userId: context.user.id,
		};
	});
