import { createEventSchema, updateEventSchema } from "@workspace/shared/validations/events"
import { z } from "zod"
import { baseContract } from "../../errors"

// Event output schema (matches database select type)
const eventSchema = z.object({
	id: z.string().uuid(),
	userId: z.string(),
	title: z.string(),
	description: z.string().nullable(),
	location: z.string().nullable(),
	startTime: z.date(),
	endTime: z.date(),
	allDay: z.boolean(),
	category: z.enum(["work", "personal", "health", "learning", "other"]).nullable(),
	isRecurring: z.boolean(),
	recurrenceRule: z.unknown().nullable(), // JSON type
	isCompleted: z.boolean(),
	completedAt: z.date().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

const eventsArraySchema = z.array(eventSchema)

// Input schemas for various queries
const getEventsInputSchema = z.object({
	startDate: z.coerce.date().optional(),
	endDate: z.coerce.date().optional(),
	category: z.enum(["work", "personal", "health", "learning", "other"]).optional(),
	limit: z.number().min(1).max(100).default(50),
	offset: z.number().min(0).default(0),
})

const getFilteredEventsInputSchema = z.object({
	filter: z.enum(["all", "today", "week", "month", "completed", "overdue", "upcoming"]).default("all"),
	category: z.enum(["work", "personal", "health", "learning", "other"]).optional(),
	startDate: z.coerce.date().optional(),
	endDate: z.coerce.date().optional(),
	limit: z.number().min(1).max(100).default(50),
	offset: z.number().min(0).default(0),
	includeCompleted: z.boolean().default(true),
})

const getOverviewOutputSchema = z.object({
	today: z.object({ count: z.number() }),
	thisWeek: z.object({ count: z.number() }),
	overdue: z.object({ count: z.number() }),
	completed: z.object({ count: z.number() }),
	upcoming: z.object({ count: z.number() }),
	categories: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			count: z.number(),
		}),
	),
	totalTasks: z.number(),
})

const getByIdInputSchema = z.object({
	id: z.string().uuid(),
})

const dateRangeInputSchema = z.object({
	startDate: z.coerce.date(),
	endDate: z.coerce.date(),
})

const updateEventInputSchema = z.object({
	id: z.string().uuid(),
	data: updateEventSchema,
})

const deleteEventInputSchema = z.object({
	id: z.string().uuid(),
})

const deleteEventOutputSchema = z.object({
	success: z.boolean(),
})

const toggleCompleteInputSchema = z.object({
	id: z.string().uuid(),
})

/**
 * Events management contracts
 */
export const eventsContract = {
	// Get all events with optional filters
	getAll: baseContract.input(getEventsInputSchema).output(eventsArraySchema),

	// Get filtered events (today, week, month, completed, overdue, upcoming)
	getFiltered: baseContract.input(getFilteredEventsInputSchema).output(eventsArraySchema),

	// Get overview statistics
	getOverview: baseContract.input(z.object({})).output(getOverviewOutputSchema),

	// Get single event by ID
	getById: baseContract.input(getByIdInputSchema).output(eventSchema),

	// Get events by date range (calendar view)
	getByDateRange: baseContract.input(dateRangeInputSchema).output(eventsArraySchema),

	// Create new event
	create: baseContract.input(createEventSchema).output(eventSchema),

	// Update existing event
	update: baseContract.input(updateEventInputSchema).output(eventSchema),

	// Delete event
	delete: baseContract.input(deleteEventInputSchema).output(deleteEventOutputSchema),

	// Get today's events
	getToday: baseContract.input(z.object({})).output(eventsArraySchema),

	// Get events in date range
	getRange: baseContract.input(dateRangeInputSchema).output(eventsArraySchema),

	// Toggle completion status
	toggleComplete: baseContract.input(toggleCompleteInputSchema).output(eventSchema),

	// Get completed events
	getCompleted: baseContract.input(z.object({})).output(eventsArraySchema),

	// Get overdue events
	getOverdue: baseContract.input(z.object({})).output(eventsArraySchema),
}
