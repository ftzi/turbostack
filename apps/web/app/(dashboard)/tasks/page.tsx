"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getErrorMessage } from "@workspace/shared/utils/error"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { CheckSquare, Clock, Plus } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"
import { CreateEventDialog } from "@/components/calendar/create-event-dialog"
import { DashboardPage } from "@/components/dashboard-page"
import { TaskMenu } from "@/components/tasks/task-menu"
import { TaskSidebar } from "@/components/tasks/task-sidebar"
import { orpc } from "@/lib/query"

type Event = {
	id: string
	userId: string
	title: string
	description: string | null
	location: string | null
	startTime: Date
	endTime: Date
	allDay: boolean
	category: "work" | "personal" | "health" | "learning" | "other" | null
	isRecurring: boolean
	recurrenceRule: unknown
	isCompleted: boolean
	completedAt: Date | null
	createdAt: Date
	updatedAt: Date
}

type FilterType = "today" | "week" | "overdue" | "completed" | "work" | "personal" | "health" | "learning" | "other"

export default function TasksPage() {
	const queryClient = useQueryClient()
	const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
	const [editingTitle, setEditingTitle] = useState("")
	const [openMenuId, setOpenMenuId] = useState<string | null>(null)
	const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null)
	const [activeFilter, setActiveFilter] = useState<FilterType>("today")

	const today = useMemo(() => new Date(), [])
	const startOfWeek = useMemo(
		() => new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()),
		[today],
	)
	const endOfWeek = useMemo(
		() => new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6),
		[today],
	)

	const dateRange = useMemo(
		() => ({
			startDate: startOfWeek,
			endDate: endOfWeek,
		}),
		[startOfWeek, endOfWeek],
	)

	const { data: todayEvents = [] } = useQuery(orpc.events.getToday.queryOptions({ input: {} }))
	const { data: overdueEvents = [] } = useQuery(orpc.events.getOverdue.queryOptions({ input: {} }))
	const { data: completedEvents = [] } = useQuery(orpc.events.getCompleted.queryOptions({ input: {} }))

	const { data: weekEvents = [] } = useQuery(
		orpc.events.getRange.queryOptions({
			input: {
				startDate: startOfWeek,
				endDate: endOfWeek,
			},
		}),
	)

	const toggleCompleteMutation = useMutation(
		orpc.events.toggleComplete.mutationOptions({
			onSuccess: () => {
				toast.success("Task status updated!")
				queryClient.invalidateQueries({ queryKey: orpc.events.getToday.queryKey({ input: {} }) })
				queryClient.invalidateQueries({ queryKey: orpc.events.getOverdue.queryKey({ input: {} }) })
				queryClient.invalidateQueries({ queryKey: orpc.events.getCompleted.queryKey({ input: {} }) })
				queryClient.invalidateQueries({ queryKey: orpc.events.getRange.queryKey({ input: dateRange }) })
			},
			onError: (error) => {
				toast.error(getErrorMessage(error, "Failed to update task status"))
			},
		}),
	)

	const deleteEventMutation = useMutation(
		orpc.events.delete.mutationOptions({
			onSuccess: () => {
				toast.success("Task deleted successfully!")
				queryClient.invalidateQueries({ queryKey: orpc.events.getToday.queryKey({ input: {} }) })
				queryClient.invalidateQueries({ queryKey: orpc.events.getOverdue.queryKey({ input: {} }) })
				queryClient.invalidateQueries({ queryKey: orpc.events.getCompleted.queryKey({ input: {} }) })
				queryClient.invalidateQueries({ queryKey: orpc.events.getRange.queryKey({ input: dateRange }) })
			},
			onError: (error) => {
				toast.error(getErrorMessage(error, "Failed to delete task"))
			},
		}),
	)

	const updateEventMutation = useMutation(
		orpc.events.update.mutationOptions({
			onSuccess: () => {
				setEditingTaskId(null)
				queryClient.invalidateQueries({ queryKey: orpc.events.getToday.queryKey({ input: {} }) })
				queryClient.invalidateQueries({ queryKey: orpc.events.getOverdue.queryKey({ input: {} }) })
				queryClient.invalidateQueries({ queryKey: orpc.events.getCompleted.queryKey({ input: {} }) })
				queryClient.invalidateQueries({ queryKey: orpc.events.getRange.queryKey({ input: dateRange }) })
			},
			onError: (error) => {
				toast.error(getErrorMessage(error, "Failed to update task"))
				setEditingTaskId(null)
			},
		}),
	)

	const handleTaskCreated = () => {
		queryClient.invalidateQueries({ queryKey: orpc.events.getToday.queryKey({ input: {} }) })
		queryClient.invalidateQueries({ queryKey: orpc.events.getOverdue.queryKey({ input: {} }) })
		queryClient.invalidateQueries({ queryKey: orpc.events.getCompleted.queryKey({ input: {} }) })
		queryClient.invalidateQueries({ queryKey: orpc.events.getRange.queryKey({ input: dateRange }) })
	}

	const handleToggleComplete = (eventId: string) => {
		toggleCompleteMutation.mutate({ id: eventId })
	}

	const handleDeleteEvent = (eventId: string) => {
		deleteEventMutation.mutate({ id: eventId })
	}

	const handleStartEdit = (event: Event) => {
		setEditingTaskId(event.id)
		setEditingTitle(event.title)
	}

	const handleSaveEdit = (eventId: string, originalTitle: string) => {
		const trimmedTitle = editingTitle.trim()
		if (trimmedTitle && trimmedTitle !== "" && trimmedTitle !== originalTitle) {
			updateEventMutation.mutate({
				id: eventId,
				data: { title: trimmedTitle },
			})
		} else {
			setEditingTaskId(null)
		}
	}

	const handleCancelEdit = () => {
		setEditingTaskId(null)
		setEditingTitle("")
	}

	const formatTime = (date: Date) =>
		new Intl.DateTimeFormat("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		}).format(new Date(date))

	const getUpcomingWeekEvents = useCallback(() => {
		const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
		return weekEvents.filter((event) => new Date(event.startTime) > todayStart && !event.isCompleted)
	}, [today, weekEvents])

	// Filter events based on active filter
	const filteredEvents = useMemo(() => {
		switch (activeFilter) {
			case "today":
				return todayEvents.filter((event) => !event.isCompleted)
			case "week":
				return getUpcomingWeekEvents()
			case "overdue":
				return overdueEvents
			case "completed":
				return completedEvents
			case "work":
			case "personal":
			case "health":
			case "learning":
			case "other":
				return [...todayEvents, ...weekEvents, ...overdueEvents, ...completedEvents].filter(
					(event) => event.category === activeFilter,
				)
			default:
				return todayEvents.filter((event) => !event.isCompleted)
		}
	}, [activeFilter, todayEvents, weekEvents, overdueEvents, completedEvents, getUpcomingWeekEvents])

	// Calculate counts for sidebar
	const filterCounts = useMemo(() => {
		const allEvents = [...todayEvents, ...weekEvents, ...overdueEvents, ...completedEvents]

		return {
			today: todayEvents.filter((event) => !event.isCompleted).length,
			week: getUpcomingWeekEvents().length,
			overdue: overdueEvents.length,
			completed: completedEvents.length,
			work: allEvents.filter((event) => event.category === "work").length,
			personal: allEvents.filter((event) => event.category === "personal").length,
			health: allEvents.filter((event) => event.category === "health").length,
			learning: allEvents.filter((event) => event.category === "learning").length,
			other: allEvents.filter((event) => event.category === "other").length,
		}
	}, [todayEvents, weekEvents, overdueEvents, completedEvents, getUpcomingWeekEvents])

	const TaskItem = ({ event, showDate = false }: { event: Event; showDate?: boolean }) => {
		const isEditing = editingTaskId === event.id

		return (
			// biome-ignore lint/a11y/noStaticElementInteractions: Task item needs hover state for menu visibility
			<div
				className="flex h-14 items-center space-x-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
				onMouseEnter={() => setHoveredTaskId(event.id)}
				onMouseLeave={() => setHoveredTaskId(null)}
			>
				<input
					type="checkbox"
					className="flex-shrink-0 rounded"
					checked={event.isCompleted}
					onChange={() => handleToggleComplete(event.id)}
				/>
				<div className="flex min-w-0 flex-1 items-center justify-between">
					<div className="min-w-0 flex-1">
						{isEditing ? (
							<Input
								value={editingTitle}
								onChange={(e) => setEditingTitle(e.target.value)}
								onBlur={() => handleSaveEdit(event.id, event.title)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										handleSaveEdit(event.id, event.title)
									} else if (e.key === "Escape") {
										handleCancelEdit()
									}
								}}
								className="m-0 h-auto border-transparent border-b border-none bg-transparent p-0 text-sm focus:border-b-gray-400 focus:border-none focus:p-0 focus:shadow-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:focus:border-b-gray-500"
								autoFocus
							/>
						) : (
							<div className="flex items-center space-x-2">
								<button
									type="button"
									className={`m-0 flex-1 cursor-text truncate p-0 text-left text-sm focus:m-0 focus:p-0 focus:shadow-none focus:outline-none focus:ring-0 dark:text-gray-300 ${
										event.isCompleted ? "text-gray-500 line-through" : ""
									}`}
									onClick={() => handleStartEdit(event)}
									onDoubleClick={() => handleStartEdit(event)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault()
											handleStartEdit(event)
										}
									}}
									onContextMenu={(e) => {
										e.preventDefault()
										setOpenMenuId(event.id)
									}}
								>
									{event.title}
								</button>
								{(showDate || !event.allDay) && (
									<div className="flex flex-shrink-0 items-center space-x-1">
										{showDate ? (
											<span className="whitespace-nowrap text-gray-500 text-xs dark:text-gray-400">
												{new Intl.DateTimeFormat("en-US", {
													weekday: "short",
													month: "short",
													day: "numeric",
												}).format(new Date(event.startTime))}
												{!event.allDay && ` ${formatTime(new Date(event.startTime))}`}
											</span>
										) : (
											!event.allDay && (
												<>
													<Clock className="h-3 w-3 flex-shrink-0 text-gray-400" />
													<span className="whitespace-nowrap text-gray-500 text-xs dark:text-gray-400">
														{formatTime(new Date(event.startTime))}
													</span>
												</>
											)
										)}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
				<div
					className={`transition-opacity ${hoveredTaskId === event.id || openMenuId === event.id ? "opacity-100" : "opacity-0"}`}
				>
					<TaskMenu
						event={event}
						onDelete={handleDeleteEvent}
						onEdit={handleStartEdit}
						open={openMenuId === event.id}
						onOpenChange={(open) => setOpenMenuId(open ? event.id : null)}
					/>
				</div>
			</div>
		)
	}

	const getFilterTitle = () => {
		switch (activeFilter) {
			case "today":
				return "Today's Tasks"
			case "week":
				return "This Week's Tasks"
			case "overdue":
				return "Overdue Tasks"
			case "completed":
				return "Completed Tasks"
			case "work":
				return "Work Tasks"
			case "personal":
				return "Personal Tasks"
			case "health":
				return "Health Tasks"
			case "learning":
				return "Learning Tasks"
			case "other":
				return "Other Tasks"
			default:
				return "Tasks"
		}
	}

	return (
		<div className="flex h-full">
			{/* Sub-sidebar */}
			<TaskSidebar activeFilter={activeFilter} onFilterChange={setActiveFilter} counts={filterCounts} />

			{/* Main content */}
			<div className="flex-1">
				<DashboardPage
					title={getFilterTitle()}
					subtitle={`${filteredEvents.length} task${filteredEvents.length !== 1 ? "s" : ""}`}
					action={
						<CreateEventDialog onSuccess={handleTaskCreated}>
							<Button className="flex items-center space-x-2">
								<Plus className="h-4 w-4" />
								<span>Add Task</span>
							</Button>
						</CreateEventDialog>
					}
				>
					{/* Filtered Tasks */}
					<div className="space-y-4">
						{filteredEvents.length === 0 ? (
							<div className="py-12 text-center">
								<CheckSquare className="mx-auto mb-4 h-12 w-12 text-gray-400" />
								<h3 className="mb-2 font-medium text-gray-900 text-lg dark:text-gray-100">No tasks found</h3>
								<p className="text-gray-500 dark:text-gray-400">
									{activeFilter === "completed" ? "No completed tasks yet." : "Create a new task to get started."}
								</p>
							</div>
						) : (
							<div className="space-y-3">
								{filteredEvents.map((event) => (
									<TaskItem key={event.id} event={event} showDate={activeFilter !== "today"} />
								))}
							</div>
						)}
					</div>
				</DashboardPage>
			</div>
		</div>
	)
}
