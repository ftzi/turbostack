import { adminContract } from "../procedures/admin/admin.contract"
import { authContract } from "../procedures/auth/auth.contract"
import { pingContract } from "../procedures/ping/ping.contract"
import { userContract } from "../procedures/user/user.contract"

/**
 * oRPC Contract Definition - composed from domain-specific contracts
 * Reference: https://orpc.unnoq.com/docs/error-handling
 *
 * Defines the API contract shared between client and server
 * Each domain (ping, auth, user, admin) has its own contract file collocated with handlers
 */
export const contract = {
	ping: pingContract,

	auth: {
		ping: authContract.ping,
		...userContract,
	},

	admin: adminContract,
}

export type Contract = typeof contract
