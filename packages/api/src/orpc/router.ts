import "server-only"
import { publicProcedure } from "./base"
import { listUsers, updateUserRole } from "./procedures/admin/admin.handler"
import { authPing } from "./procedures/auth/auth.handler"
import * as eventsHandlers from "./procedures/events/events.handler"
import * as goalsHandlers from "./procedures/goals/goals.handler"
import { ping } from "./procedures/ping/ping.handler"
import { getCurrentUser, updateUser } from "./procedures/user/user.handler"

/**
 * Main oRPC router
 * Uses .router() method to enforce the contract at runtime
 * This ensures type-checking and runtime validation of the entire API
 */
export const router = publicProcedure.router({
	ping,
	auth: {
		ping: authPing,
		getCurrentUser,
		updateUser,
	},
	admin: {
		listUsers,
		updateUserRole,
	},
	events: {
		getAll: eventsHandlers.getAll,
		getFiltered: eventsHandlers.getFiltered,
		getOverview: eventsHandlers.getOverview,
		getById: eventsHandlers.getById,
		getByDateRange: eventsHandlers.getByDateRange,
		create: eventsHandlers.create,
		update: eventsHandlers.update,
		delete: eventsHandlers.deleteEvent,
		getToday: eventsHandlers.getToday,
		getRange: eventsHandlers.getRange,
		toggleComplete: eventsHandlers.toggleComplete,
		getCompleted: eventsHandlers.getCompleted,
		getOverdue: eventsHandlers.getOverdue,
	},
	goals: {
		getAll: goalsHandlers.getAll,
		create: goalsHandlers.create,
		update: goalsHandlers.update,
		delete: goalsHandlers.deleteGoal,
	},
})

export type Router = typeof router
