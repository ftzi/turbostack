import { oc } from "@orpc/contract"
import {
	authPingInputSchema,
	authPingOutputSchema,
	pingInputSchema,
	pingOutputSchema,
} from "./schemas/auth.js"
import { commonErrors } from "./schemas/errors.js"
import {
	getCurrentUserInputSchema,
	getCurrentUserOutputSchema,
	updateUserInputSchema,
	updateUserOutputSchema,
} from "./schemas/user.js"

/**
 * oRPC Contract Definition with generic error handling
 * Reference: https://orpc.unnoq.com/docs/error-handling
 *
 * Defines the API contract shared between client and server
 * All procedures inherit commonErrors for consistent error handling
 */
const baseContract = oc.errors(commonErrors)

export const contract = {
	ping: baseContract.input(pingInputSchema).output(pingOutputSchema),

	auth: {
		ping: baseContract.input(authPingInputSchema).output(authPingOutputSchema),
		getCurrentUser: baseContract
			.input(getCurrentUserInputSchema)
			.output(getCurrentUserOutputSchema),
		updateUser: baseContract
			.input(updateUserInputSchema)
			.output(updateUserOutputSchema),
	},
}

export type Contract = typeof contract
