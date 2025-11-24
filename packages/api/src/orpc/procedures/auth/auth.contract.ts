import { z } from "zod"
import { baseContract } from "../../errors.js"

/**
 * Schema for authenticated ping endpoint
 */
const authPingInputSchema = z.object({})

const authPingOutputSchema = z.object({
	message: z.string(),
	timestamp: z.number(),
	userId: z.string(),
})

/**
 * Auth-related contracts
 */
export const authContract = {
	ping: baseContract.input(authPingInputSchema).output(authPingOutputSchema),
}
