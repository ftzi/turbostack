"use client"

import { Button } from "@workspace/ui/components/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"

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

type TaskMenuProps = {
	event: Event
	onDelete: (eventId: string) => void
	onEdit: (event: Event) => void
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

export function TaskMenu({ event, onDelete, onEdit, open, onOpenChange }: TaskMenuProps) {
	return (
		<DropdownMenu open={open ?? false} onOpenChange={onOpenChange}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
					<MoreHorizontal className="h-4 w-4" />
					<span className="sr-only">Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => onEdit(event)}>
					<Edit className="mr-2 h-4 w-4" />
					Edit
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => onDelete(event.id)} className="text-red-600 focus:text-red-600">
					<Trash2 className="mr-2 h-4 w-4" />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
