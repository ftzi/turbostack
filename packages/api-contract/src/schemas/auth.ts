import { z } from "zod"

/**
 * Schema for ping endpoint (public)
 */
export const pingInputSchema = z.object({})

export const pingOutputSchema = z.object({
	message: z.string(),
	timestamp: z.number(),
})

/**
 * Schema for authenticated ping endpoint
 */
export const authPingInputSchema = z.object({})

export const authPingOutputSchema = z.object({
	message: z.string(),
	timestamp: z.number(),
	userId: z.string(),
})
