"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@workspace/ui/components/button"
import { Plus } from "lucide-react"
import moment from "moment"
import { useMemo, useState } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import { CreateEventDialog } from "@/components/calendar/create-event-dialog"
import { orpc } from "@/lib/query"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "./calendar.css"

const localizer = momentLocalizer(moment)

export default function CalendarPage() {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date())
	const queryClient = useQueryClient()

	// Memoize date range to prevent infinite refetches
	const dateRange = useMemo(
		() => ({
			startDate: moment().subtract(2, "months").toDate(),
			endDate: moment().add(2, "months").toDate(),
		}),
		[],
	)

	// Get events for a wider range to support different calendar views
	const { data: events } = useQuery(orpc.events.getRange.queryOptions({ input: dateRange }))

	// Transform events for react-big-calendar
	const calendarEvents = useMemo(() => {
		if (!events) return []

		return events.map((event) => ({
			id: event.id,
			title: event.title,
			start: new Date(event.startTime),
			end: new Date(event.endTime),
			resource: event,
		}))
	}, [events])

	const handleEventCreated = () => {
		queryClient.invalidateQueries({ queryKey: orpc.events.getRange.queryKey({ input: dateRange }) })
	}

	const [showCreateDialog, setShowCreateDialog] = useState(false)

	const handleSelectSlot = ({ start }: { start: Date }) => {
		setSelectedDate(start)
		setShowCreateDialog(true)
	}

	const handleSelectEvent = (event: { id: string; title: string; start: Date; end: Date; resource: unknown }) => {
		// Could open edit dialog here in the future
		console.log("LOG:", JSON.stringify(event, null, 2))
	}

	const handleDialogClose = () => {
		setShowCreateDialog(false)
	}

	return (
		<div className="flex h-screen w-full flex-col overflow-hidden p-6">
			{/* Header with Add Event button */}
			<div className="mb-4 flex justify-end">
				<CreateEventDialog onSuccess={handleEventCreated}>
					<Button className="flex items-center space-x-2">
						<Plus className="h-4 w-4" />
						<span>Add Event</span>
					</Button>
				</CreateEventDialog>
			</div>

			{/* Create Event Dialog for slot selection */}
			<CreateEventDialog
				open={showCreateDialog}
				onOpenChange={setShowCreateDialog}
				onSuccess={() => {
					handleEventCreated()
					handleDialogClose()
				}}
				defaultDate={selectedDate}
			/>

			{/* Calendar */}
			<div className="min-h-0 flex-1">
				<Calendar
					localizer={localizer}
					events={calendarEvents}
					startAccessor="start"
					endAccessor="end"
					onSelectSlot={handleSelectSlot}
					onSelectEvent={handleSelectEvent}
					selectable
					views={["month", "week", "day", "agenda"]}
					defaultView="month"
					step={30}
					showMultiDayTimes
					className="bg-background text-foreground"
				/>
			</div>
		</div>
	)
}
