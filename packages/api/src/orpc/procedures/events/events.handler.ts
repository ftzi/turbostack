import "server-only"
import { db } from "@workspace/server/db"
import { events } from "@workspace/server/db/schema"
import { and, desc, eq, gte, lte, sql } from "drizzle-orm"
import { protectedProcedure } from "../../middleware/auth"

/**
 * Get all events for the authenticated user with optional filters
 */
export const getAll = protectedProcedure.events.getAll.handler(async ({ input, context }) => {
	const whereConditions = [eq(events.userId, context.user.id)]

	if (input.startDate) {
		whereConditions.push(gte(events.startTime, input.startDate))
	}

	if (input.endDate) {
		whereConditions.push(lte(events.startTime, input.endDate))
	}

	if (input.category) {
		whereConditions.push(eq(events.category, input.category))
	}

	const userEvents = await db
		.select()
		.from(events)
		.where(and(...whereConditions))
		.orderBy(desc(events.startTime))
		.limit(input.limit)
		.offset(input.offset)

	return userEvents
})

/**
 * Get filtered events (unified endpoint that replaces individual getToday, getOverdue, etc.)
 */
export const getFiltered = protectedProcedure.events.getFiltered.handler(async ({ input, context }) => {
	const whereConditions = [eq(events.userId, context.user.id)]

	// Handle different filter types
	const now = new Date()
	let calculatedStartDate = input.startDate
	let calculatedEndDate = input.endDate
	let useCompletedAtOrder = false

	switch (input.filter) {
		case "today": {
			const today = new Date()
			calculatedStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
			calculatedEndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
			break
		}
		case "week": {
			const today = new Date()
			const dayOfWeek = today.getDay()
			const startOfWeek = new Date(today)
			startOfWeek.setDate(today.getDate() - dayOfWeek)
			startOfWeek.setHours(0, 0, 0, 0)

			const endOfWeek = new Date(startOfWeek)
			endOfWeek.setDate(startOfWeek.getDate() + 7)

			calculatedStartDate = startOfWeek
			calculatedEndDate = endOfWeek
			break
		}
		case "month": {
			const today = new Date()
			calculatedStartDate = new Date(today.getFullYear(), today.getMonth(), 1)
			calculatedEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 1)
			break
		}
		case "completed": {
			whereConditions.push(eq(events.isCompleted, true))
			useCompletedAtOrder = true
			break
		}
		case "overdue": {
			whereConditions.push(eq(events.isCompleted, false))
			whereConditions.push(lte(events.endTime, now))
			break
		}
		case "upcoming": {
			whereConditions.push(eq(events.isCompleted, false))
			whereConditions.push(gte(events.startTime, now))
			break
		}
	}

	// Apply date filters
	if (calculatedStartDate) {
		whereConditions.push(gte(events.startTime, calculatedStartDate))
	}
	if (calculatedEndDate) {
		whereConditions.push(lte(events.startTime, calculatedEndDate))
	}

	// Apply category filter
	if (input.category) {
		whereConditions.push(eq(events.category, input.category))
	}

	// Apply completion filter (unless specifically getting completed tasks)
	if (!input.includeCompleted && input.filter !== "completed") {
		whereConditions.push(eq(events.isCompleted, false))
	}

	const baseQuery = db
		.select()
		.from(events)
		.where(and(...whereConditions))
		.limit(input.limit)
		.offset(input.offset)

	const userEvents = useCompletedAtOrder
		? await baseQuery.orderBy(desc(events.completedAt))
		: await baseQuery.orderBy(events.startTime)

	return userEvents
})

/**
 * Get overview statistics for tasks/events (counts for different views)
 */
export const getOverview = protectedProcedure.events.getOverview.handler(async ({ context }) => {
	const userId = context.user.id
	const now = new Date()

	// Calculate date ranges
	const today = new Date()
	const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
	const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

	const dayOfWeek = today.getDay()
	const startOfWeek = new Date(today)
	startOfWeek.setDate(today.getDate() - dayOfWeek)
	startOfWeek.setHours(0, 0, 0, 0)
	const endOfWeek = new Date(startOfWeek)
	endOfWeek.setDate(startOfWeek.getDate() + 7)

	// Get counts for different views
	const [todayCount, thisWeekCount, overdueCount, completedCount, upcomingCount, categoryStats] = await Promise.all([
		// Today's tasks
		db
			.select({ count: sql`count(*)` })
			.from(events)
			.where(and(eq(events.userId, userId), gte(events.startTime, startOfToday), lte(events.startTime, endOfToday)))
			.then((result) => Number(result[0]?.count ?? 0)),

		// This week's tasks
		db
			.select({ count: sql`count(*)` })
			.from(events)
			.where(and(eq(events.userId, userId), gte(events.startTime, startOfWeek), lte(events.startTime, endOfWeek)))
			.then((result) => Number(result[0]?.count ?? 0)),

		// Overdue tasks
		db
			.select({ count: sql`count(*)` })
			.from(events)
			.where(and(eq(events.userId, userId), eq(events.isCompleted, false), lte(events.endTime, now)))
			.then((result) => Number(result[0]?.count ?? 0)),

		// Completed tasks
		db
			.select({ count: sql`count(*)` })
			.from(events)
			.where(and(eq(events.userId, userId), eq(events.isCompleted, true)))
			.then((result) => Number(result[0]?.count ?? 0)),

		// Upcoming tasks (not completed, future start time)
		db
			.select({ count: sql`count(*)` })
			.from(events)
			.where(and(eq(events.userId, userId), eq(events.isCompleted, false), gte(events.startTime, now)))
			.then((result) => Number(result[0]?.count ?? 0)),

		// Category statistics
		db
			.select({
				category: events.category,
				count: sql`count(*)`,
			})
			.from(events)
			.where(eq(events.userId, userId))
			.groupBy(events.category)
			.then((results) =>
				results
					.filter((row) => row.category !== null)
					.map((row) => {
						const category = row.category as "work" | "personal" | "health" | "learning" | "other"
						return {
							id: category,
							name: category.charAt(0).toUpperCase() + category.slice(1),
							count: Number(row.count),
						}
					}),
			),
	])

	return {
		today: { count: todayCount },
		thisWeek: { count: thisWeekCount },
		overdue: { count: overdueCount },
		completed: { count: completedCount },
		upcoming: { count: upcomingCount },
		categories: categoryStats,
		totalTasks: categoryStats.reduce((sum, cat) => sum + cat.count, 0),
	}
})

/**
 * Get a single event by ID
 */
export const getById = protectedProcedure.events.getById.handler(async ({ input, context, errors }) => {
	const event = await db
		.select()
		.from(events)
		.where(and(eq(events.id, input.id), eq(events.userId, context.user.id)))
		.limit(1)

	if (!event[0]) {
		throw errors.operationFailed({
			data: { message: "Event not found" },
		})
	}

	return event[0]
})

/**
 * Get events for a specific date range (useful for calendar views)
 */
export const getByDateRange = protectedProcedure.events.getByDateRange.handler(async ({ input, context }) => {
	const userEvents = await db
		.select()
		.from(events)
		.where(
			and(
				eq(events.userId, context.user.id),
				gte(events.startTime, input.startDate),
				lte(events.endTime, input.endDate),
			),
		)
		.orderBy(events.startTime)

	return userEvents
})

/**
 * Create a new event
 */
export const create = protectedProcedure.events.create.handler(async ({ input, context, errors }) => {
	const [newEvent] = await db
		.insert(events)
		.values({
			...input,
			userId: context.user.id,
			updatedAt: new Date(),
		})
		.returning()

	if (!newEvent) {
		throw errors.operationFailed({
			data: { message: "Failed to create event" },
		})
	}

	return newEvent
})

/**
 * Update an existing event
 */
export const update = protectedProcedure.events.update.handler(async ({ input, context, errors }) => {
	// Verify the event belongs to the user
	const existingEvent = await db
		.select()
		.from(events)
		.where(and(eq(events.id, input.id), eq(events.userId, context.user.id)))
		.limit(1)

	if (!existingEvent[0]) {
		throw errors.operationFailed({
			data: { message: "Event not found or you don't have permission to update it" },
		})
	}

	const [updatedEvent] = await db
		.update(events)
		.set({
			...input.data,
			updatedAt: new Date(),
		})
		.where(eq(events.id, input.id))
		.returning()

	if (!updatedEvent) {
		throw errors.operationFailed({
			data: { message: "Failed to update event" },
		})
	}

	return updatedEvent
})

/**
 * Delete an event
 */
export const deleteEvent = protectedProcedure.events.delete.handler(async ({ input, context, errors }) => {
	// Verify the event belongs to the user
	const existingEvent = await db
		.select()
		.from(events)
		.where(and(eq(events.id, input.id), eq(events.userId, context.user.id)))
		.limit(1)

	if (!existingEvent[0]) {
		throw errors.operationFailed({
			data: { message: "Event not found or you don't have permission to delete it" },
		})
	}

	await db.delete(events).where(eq(events.id, input.id))

	return { success: true }
})

/**
 * Get events for today
 */
export const getToday = protectedProcedure.events.getToday.handler(async ({ context }) => {
	const today = new Date()
	const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
	const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

	const todayEvents = await db
		.select()
		.from(events)
		.where(and(eq(events.userId, context.user.id), gte(events.startTime, startOfDay), lte(events.startTime, endOfDay)))
		.orderBy(events.startTime)

	return todayEvents
})

/**
 * Get events for a date range (for calendar view)
 */
export const getRange = protectedProcedure.events.getRange.handler(async ({ input, context }) => {
	const userEvents = await db
		.select()
		.from(events)
		.where(
			and(
				eq(events.userId, context.user.id),
				gte(events.startTime, input.startDate),
				lte(events.startTime, input.endDate),
			),
		)
		.orderBy(events.startTime)

	return userEvents
})

/**
 * Toggle task completion status
 */
export const toggleComplete = protectedProcedure.events.toggleComplete.handler(async ({ input, context, errors }) => {
	// Verify the event belongs to the user
	const existingEvent = await db
		.select()
		.from(events)
		.where(and(eq(events.id, input.id), eq(events.userId, context.user.id)))
		.limit(1)

	if (!existingEvent[0]) {
		throw errors.operationFailed({
			data: { message: "Event not found or you don't have permission to update it" },
		})
	}

	const currentEvent = existingEvent[0]
	const newCompletedStatus = !currentEvent.isCompleted

	const [updatedEvent] = await db
		.update(events)
		.set({
			isCompleted: newCompletedStatus,
			completedAt: newCompletedStatus ? new Date() : null,
			updatedAt: new Date(),
		})
		.where(eq(events.id, input.id))
		.returning()

	if (!updatedEvent) {
		throw errors.operationFailed({
			data: { message: "Failed to toggle completion status" },
		})
	}

	return updatedEvent
})

/**
 * Get completed tasks
 */
export const getCompleted = protectedProcedure.events.getCompleted.handler(async ({ context }) => {
	const completedEvents = await db
		.select()
		.from(events)
		.where(and(eq(events.userId, context.user.id), eq(events.isCompleted, true)))
		.orderBy(desc(events.completedAt))

	return completedEvents
})

/**
 * Get overdue tasks (past due date and not completed)
 */
export const getOverdue = protectedProcedure.events.getOverdue.handler(async ({ context }) => {
	const now = new Date()
	const overdueEvents = await db
		.select()
		.from(events)
		.where(and(eq(events.userId, context.user.id), eq(events.isCompleted, false), lte(events.endTime, now)))
		.orderBy(events.startTime)

	return overdueEvents
})
