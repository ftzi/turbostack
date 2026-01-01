"use client"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { AlertTriangle, Calendar, CheckSquare, Clock } from "lucide-react"

type FilterType = "today" | "week" | "overdue" | "completed" | "work" | "personal" | "health" | "learning" | "other"

type TaskSidebarProps = {
	activeFilter: FilterType
	onFilterChange: (filter: FilterType) => void
	counts: {
		today: number
		week: number
		overdue: number
		completed: number
		work: number
		personal: number
		health: number
		learning: number
		other: number
	}
}

const filters = [
	{
		type: "today" as const,
		label: "Today",
		icon: CheckSquare,
		description: "Tasks due today",
	},
	{
		type: "week" as const,
		label: "This Week",
		icon: Calendar,
		description: "Tasks due this week",
	},
	{
		type: "overdue" as const,
		label: "Overdue",
		icon: AlertTriangle,
		description: "Past due tasks",
		className: "text-red-600 dark:text-red-400",
	},
	{
		type: "completed" as const,
		label: "Completed",
		icon: CheckSquare,
		description: "Finished tasks",
		className: "text-green-600 dark:text-green-400",
	},
]

const categories = [
	{
		type: "work" as const,
		label: "Work",
		icon: Clock,
		description: "Work-related tasks",
	},
	{
		type: "personal" as const,
		label: "Personal",
		icon: CheckSquare,
		description: "Personal tasks",
	},
	{
		type: "health" as const,
		label: "Health",
		icon: CheckSquare,
		description: "Health-related tasks",
	},
	{
		type: "learning" as const,
		label: "Learning",
		icon: CheckSquare,
		description: "Learning and education",
	},
	{
		type: "other" as const,
		label: "Other",
		icon: CheckSquare,
		description: "Miscellaneous tasks",
	},
]

export function TaskSidebar({ activeFilter, onFilterChange, counts }: TaskSidebarProps) {
	return (
		<div className="h-full w-64 overflow-y-auto border-gray-200 border-r bg-white dark:border-gray-700 dark:bg-gray-800">
			<div className="space-y-6 p-4">
				{/* Time-based filters */}
				<div>
					<h3 className="mb-3 font-medium text-gray-900 text-sm dark:text-gray-100">Time</h3>
					<div className="space-y-1">
						{filters.map((filter) => {
							const Icon = filter.icon
							const count = counts[filter.type]
							const isActive = activeFilter === filter.type

							return (
								<Button
									key={filter.type}
									variant="ghost"
									size="sm"
									onClick={() => onFilterChange(filter.type)}
									className={cn(
										"h-8 w-full justify-between px-3",
										isActive && "bg-gray-100 dark:bg-gray-700",
										filter.className,
									)}
								>
									<div className="flex items-center space-x-2">
										<Icon className="h-4 w-4" />
										<span className="text-sm">{filter.label}</span>
									</div>
									{count > 0 && (
										<span className="rounded-full bg-gray-200 px-2 py-0.5 text-gray-700 text-xs dark:bg-gray-600 dark:text-gray-300">
											{count}
										</span>
									)}
								</Button>
							)
						})}
					</div>
				</div>

				{/* Category-based filters */}
				<div>
					<h3 className="mb-3 font-medium text-gray-900 text-sm dark:text-gray-100">Categories</h3>
					<div className="space-y-1">
						{categories.map((category) => {
							const Icon = category.icon
							const count = counts[category.type]
							const isActive = activeFilter === category.type

							return (
								<Button
									key={category.type}
									variant="ghost"
									size="sm"
									onClick={() => onFilterChange(category.type)}
									className={cn("h-8 w-full justify-between px-3", isActive && "bg-gray-100 dark:bg-gray-700")}
								>
									<div className="flex items-center space-x-2">
										<Icon className="h-4 w-4" />
										<span className="text-sm">{category.label}</span>
									</div>
									{count > 0 && (
										<span className="rounded-full bg-gray-200 px-2 py-0.5 text-gray-700 text-xs dark:bg-gray-600 dark:text-gray-300">
											{count}
										</span>
									)}
								</Button>
							)
						})}
					</div>
				</div>
			</div>
		</div>
	)
}
