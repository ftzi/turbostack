import { z } from "zod"

// Shared goal validation schemas used by both frontend and backend

// Base goal data that can be created/updated
export const baseGoalSchema = z.object({
	title: z.string().min(1, "Title is required").max(200),
	description: z.string().optional(),
})

// Create goal schema
export const createGoalSchema = baseGoalSchema

// Update goal schema (all fields optional)
export const updateGoalSchema = baseGoalSchema.partial()

// Frontend form schema - used by forms
export const goalFormSchema = baseGoalSchema

// Type exports
export type CreateGoalInput = z.infer<typeof createGoalSchema>
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>
export type GoalFormData = z.infer<typeof goalFormSchema>
