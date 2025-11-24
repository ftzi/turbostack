import { authContract } from "../procedures/auth/auth.contract.js"
import { pingContract } from "../procedures/ping/ping.contract.js"
import { userContract } from "../procedures/user/user.contract.js"

/**
 * oRPC Contract Definition - composed from domain-specific contracts
 * Reference: https://orpc.unnoq.com/docs/error-handling
 *
 * Defines the API contract shared between client and server
 * Each domain (ping, auth, user) has its own contract file collocated with handlers
 */
export const contract = {
	ping: pingContract,

	auth: {
		ping: authContract.ping,
		...userContract,
	},
}

export type Contract = typeof contract
