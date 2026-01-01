import { z } from "zod"

// Shared event validation schemas used by both frontend and backend

// Base schema structure for shared validation rules
const baseEventFields = {
	title: z.string().min(1, "Title is required").max(200),
	description: z.string().optional(),
	location: z.string().optional(),
	allDay: z.boolean().default(false),
	category: z.enum(["work", "personal", "health", "learning", "other"]).optional(),
	isRecurring: z.boolean().default(false),
	recurrenceRule: z
		.object({
			frequency: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
			interval: z.number().min(1).max(365).optional(),
			endDate: z.date().optional(),
			count: z.number().min(1).max(1000).optional(),
		})
		.optional(),
	isCompleted: z.boolean().default(false),
	completedAt: z.coerce.date().optional(),
}

// Frontend form schema - uses Date objects directly
export const eventFormSchema = z
	.object({
		...baseEventFields,
		startTime: z.date(),
		endTime: z.date(),
		// Allow these to be optional in forms and provide defaults during submission
		allDay: z.boolean().optional(),
		isRecurring: z.boolean().optional(),
		isCompleted: z.boolean().optional(),
		completedAt: z.date().optional(),
	})
	.refine((data) => data.endTime > data.startTime, {
		message: "End time must be after start time",
		path: ["endTime"],
	})

// Backend/API schema - uses coerce for network serialization
export const createEventSchema = z
	.object({
		...baseEventFields,
		startTime: z.coerce.date(),
		endTime: z.coerce.date(),
	})
	.refine((data) => data.endTime > data.startTime, {
		message: "End time must be after start time",
		path: ["endTime"],
	})

// Update event schema (all fields optional except refinement)
export const updateEventSchema = z
	.object({
		...baseEventFields,
		startTime: z.coerce.date(),
		endTime: z.coerce.date(),
	})
	.partial()
	.refine(
		(data) => {
			// Only validate date range if both dates are provided
			if (data.startTime && data.endTime) {
				return data.endTime > data.startTime
			}
			return true
		},
		{
			message: "End time must be after start time",
			path: ["endTime"],
		},
	)

// Type exports
export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
export type EventFormData = z.infer<typeof eventFormSchema>
