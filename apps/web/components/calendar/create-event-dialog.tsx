"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getErrorMessage } from "@workspace/shared/utils/error"
import { type EventFormData, eventFormSchema } from "@workspace/shared/validations/events"
import { Button } from "@workspace/ui/components/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Textarea } from "@workspace/ui/components/textarea"
import { CalendarDays, MapPin, Tag } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { formatDateLocal, formatDateTimeLocal, getNext30MinuteInterval } from "@/lib/date-utils"
import { orpc } from "@/lib/query"

type CreateEventDialogProps = {
	children?: React.ReactNode
	defaultDate?: Date
	onSuccess?: () => void
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

const categories = [
	{ value: "work", label: "Work", icon: "💼" },
	{ value: "personal", label: "Personal", icon: "👤" },
	{ value: "health", label: "Health", icon: "🏃" },
	{ value: "learning", label: "Learning", icon: "📚" },
	{ value: "other", label: "Other", icon: "📌" },
]

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Form component with multiple fields is inherently complex
export function CreateEventDialog({
	children,
	defaultDate,
	onSuccess,
	open: controlledOpen,
	onOpenChange: controlledOnOpenChange,
}: CreateEventDialogProps) {
	const [internalOpen, setInternalOpen] = useState(false)

	const open = controlledOpen !== undefined ? controlledOpen : internalOpen
	const setOpen = controlledOnOpenChange || setInternalOpen

	const _queryClient = useQueryClient()

	const createEvent = useMutation(
		orpc.events.create.mutationOptions({
			onSuccess: () => {
				toast.success("Event created successfully!")
				setOpen(false)
				reset()
				onSuccess?.()
			},
			onError: (error) => {
				toast.error(getErrorMessage(error, "Failed to create event"))
			},
		}),
	)

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<EventFormData>({
		resolver: zodResolver(eventFormSchema),
		defaultValues: {
			title: "",
			description: "",
			location: "",
			startTime: getNext30MinuteInterval(),
			endTime: new Date(getNext30MinuteInterval().getTime() + 60 * 60 * 1000),
			allDay: false,
			isRecurring: false,
		},
	})

	// Reset form when defaultDate changes or dialog opens
	useEffect(() => {
		if (open) {
			const baseStartTime = defaultDate ? getNext30MinuteInterval(defaultDate) : getNext30MinuteInterval()
			const endTime = new Date(baseStartTime.getTime() + 60 * 60 * 1000)

			const newDefaults = {
				title: "",
				description: "",
				location: "",
				startTime: baseStartTime,
				endTime: endTime,
				allDay: false,
				isRecurring: false,
			}
			reset(newDefaults)
		}
	}, [open, defaultDate, reset])

	const allDay = watch("allDay")

	const onSubmit = (data: EventFormData) => {
		// Ensure required fields have proper defaults
		const eventData = {
			...data,
			allDay: data.allDay ?? false,
			isRecurring: data.isRecurring ?? false,
		}

		createEvent.mutate(eventData)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{children && <DialogTrigger asChild>{children}</DialogTrigger>}
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<CalendarDays className="h-5 w-5" />
						Create New Event
					</DialogTitle>
					<DialogDescription>Add a new event to your calendar. Fill in the details below.</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{/* Title */}
					<div className="space-y-2">
						<Label htmlFor="title">Title *</Label>
						<Input
							id="title"
							placeholder="Event title"
							{...register("title")}
							className={errors.title ? "border-red-500" : ""}
						/>
						{errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
					</div>

					{/* Description */}
					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							placeholder="Event description (optional)"
							{...register("description")}
							rows={3}
						/>
					</div>

					{/* Location */}
					<div className="space-y-2">
						<Label htmlFor="location" className="flex items-center gap-2">
							<MapPin className="h-4 w-4" />
							Location
						</Label>
						<Input id="location" placeholder="Event location (optional)" {...register("location")} />
					</div>

					{/* Date and Time */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="startTime">Start {allDay ? "Date" : "Date & Time"}</Label>
							<div className="relative">
								<Input
									id="startTime"
									type={allDay ? "date" : "datetime-local"}
									value={
										allDay
											? formatDateLocal(watch("startTime") || getNext30MinuteInterval())
											: formatDateTimeLocal(watch("startTime") || getNext30MinuteInterval())
									}
									onChange={(e) => {
										setValue("startTime", new Date(e.target.value))
									}}
									className={`pr-10 ${errors.startTime ? "border-red-500" : ""}`}
								/>
								<CalendarDays className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
							</div>
							{errors.startTime && <p className="text-red-500 text-sm">{errors.startTime.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="endTime">End {allDay ? "Date" : "Date & Time"}</Label>
							<div className="relative">
								<Input
									id="endTime"
									type={allDay ? "date" : "datetime-local"}
									value={
										allDay
											? formatDateLocal(
													watch("endTime") || new Date(getNext30MinuteInterval().getTime() + 60 * 60 * 1000),
												)
											: formatDateTimeLocal(
													watch("endTime") || new Date(getNext30MinuteInterval().getTime() + 60 * 60 * 1000),
												)
									}
									onChange={(e) => {
										setValue("endTime", new Date(e.target.value))
									}}
									className={`pr-10 ${errors.endTime ? "border-red-500" : ""}`}
								/>
								<CalendarDays className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
							</div>
							{errors.endTime && <p className="text-red-500 text-sm">{errors.endTime.message}</p>}
						</div>
					</div>

					{/* All Day Toggle */}
					<div className="flex items-center space-x-2">
						<input
							type="checkbox"
							id="allDay"
							{...register("allDay")}
							className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<Label htmlFor="allDay" className="font-medium text-sm">
							All day event
						</Label>
					</div>

					{/* Category */}
					<div className="space-y-2">
						<Label className="flex items-center gap-2">
							<Tag className="h-4 w-4" />
							Category
						</Label>
						<Select
							onValueChange={(value) =>
								setValue("category", value as "work" | "personal" | "health" | "learning" | "other" | undefined)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a category" />
							</SelectTrigger>
							<SelectContent>
								{categories.map((category) => (
									<SelectItem key={category.value} value={category.value}>
										<span className="flex items-center gap-2">
											<span>{category.icon}</span>
											{category.label}
										</span>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Creating..." : "Create Event"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
