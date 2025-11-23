import { oc } from "@orpc/contract"
import {
	authPingInputSchema,
	authPingOutputSchema,
	pingInputSchema,
	pingOutputSchema,
} from "./schemas/auth.js"
import {
	getCurrentUserInputSchema,
	getCurrentUserOutputSchema,
	updateUserInputSchema,
	updateUserOutputSchema,
} from "./schemas/user.js"

/**
 * oRPC Contract Definition
 * Defines the API contract shared between client and server
 */
export const contract = {
	ping: oc.input(pingInputSchema).output(pingOutputSchema),

	auth: {
		ping: oc.input(authPingInputSchema).output(authPingOutputSchema),
		getCurrentUser: oc
			.input(getCurrentUserInputSchema)
			.output(getCurrentUserOutputSchema),
		updateUser: oc.input(updateUserInputSchema).output(updateUserOutputSchema),
	},
}

export type Contract = typeof contract
