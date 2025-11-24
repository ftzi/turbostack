import { z } from "zod"
import { baseContract } from "../../errors.js"

/**
 * Schema for ping endpoint (public)
 */
const pingInputSchema = z.object({})

const pingOutputSchema = z.object({
	message: z.string(),
	timestamp: z.number(),
})

/**
 * Public ping contract
 */
export const pingContract = baseContract.input(pingInputSchema).output(pingOutputSchema)
