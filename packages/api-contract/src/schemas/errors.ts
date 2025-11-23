import { z } from "zod"

/**
 * Generic error schemas for oRPC procedures
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
	 * Generic operation failure error
	 * Use this for database failures, external API errors, etc.
	 */
	OPERATION_FAILED: {
		data: z.object({
			message: z.string(),
		}),
	},
}
