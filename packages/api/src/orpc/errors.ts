import { oc } from "@orpc/contract"
import { z } from "zod"

/**
 * Common errors for all oRPC procedures
 * Reference: https://orpc.unnoq.com/docs/error-handling
 *
 * These errors can be reused across all procedures instead of defining
 * specific errors for each operation. Keep it simple!
 *
 * SECURITY NOTE: Never include sensitive information in error.data
 * as it is sent to the client.
 */
export const commonErrors = {
	/**
	 * Authentication required error
	 * Use this when a user tries to access a protected resource without authentication
	 */
	UNAUTHORIZED: {
		data: z.object({
			message: z.string(),
		}),
	},
	/**
	 * Generic operation failure error
	 * Use this for database failures, external API errors, etc.
	 */
	OPERATION_FAILED: {
		data: z.object({
			message: z.string(),
		}),
	},
}

/**
 * Base contract with common errors applied
 * Import this in your contract files instead of creating it repeatedly
 */
export const baseContract = oc.errors(commonErrors)
