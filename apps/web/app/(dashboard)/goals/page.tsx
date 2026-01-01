"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getErrorMessage } from "@workspace/shared/utils/error"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Brain, CheckCircle, Edit, MoreVertical, Plus, Target, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { DashboardPage } from "@/components/dashboard-page"
import { orpc } from "@/lib/query"

export default function GoalsPage() {
	const [newGoalTitle, setNewGoalTitle] = useState("")
	const [newGoalDescription, setNewGoalDescription] = useState("")
	const [isAdding, setIsAdding] = useState(false)
	const [editingGoal, setEditingGoal] = useState<string | null>(null)
	const [editTitle, setEditTitle] = useState("")
	const [editDescription, setEditDescription] = useState("")

	const queryClient = useQueryClient()
	const { data: goals = [] } = useQuery(orpc.goals.getAll.queryOptions({ input: {} }))

	const createGoalMutation = useMutation(
		orpc.goals.create.mutationOptions({
			onSuccess: () => {
				toast.success("Goal created successfully!")
				queryClient.invalidateQueries({ queryKey: orpc.goals.getAll.queryKey({ input: {} }) })
				setNewGoalTitle("")
				setNewGoalDescription("")
				setIsAdding(false)
			},
			onError: (error) => {
				toast.error(getErrorMessage(error, "Failed to create goal"))
				setIsAdding(false)
			},
		}),
	)

	const deleteGoalMutation = useMutation(
		orpc.goals.delete.mutationOptions({
			onSuccess: () => {
				toast.success("Goal deleted successfully!")
				queryClient.invalidateQueries({ queryKey: orpc.goals.getAll.queryKey({ input: {} }) })
			},
			onError: (error) => {
				toast.error(getErrorMessage(error, "Failed to delete goal"))
			},
		}),
	)

	const updateGoalMutation = useMutation(
		orpc.goals.update.mutationOptions({
			onSuccess: () => {
				toast.success("Goal updated successfully!")
				queryClient.invalidateQueries({ queryKey: orpc.goals.getAll.queryKey({ input: {} }) })
				setEditingGoal(null)
				setEditTitle("")
				setEditDescription("")
			},
			onError: (error) => {
				toast.error(getErrorMessage(error, "Failed to update goal"))
			},
		}),
	)

	const handleAddGoal = () => {
		if (!newGoalTitle.trim()) return

		setIsAdding(true)
		createGoalMutation.mutate({
			title: newGoalTitle.trim(),
			description: newGoalDescription.trim() || undefined,
		})
	}

	const handleDeleteGoal = (goalId: string) => {
		deleteGoalMutation.mutate({ id: goalId })
	}

	const handleStartEdit = (goal: { id: string; title: string; description?: string | null }) => {
		setEditingGoal(goal.id)
		setEditTitle(goal.title)
		setEditDescription(goal.description || "")
	}

	const handleUpdateGoal = () => {
		if (!(editTitle.trim() && editingGoal)) return

		updateGoalMutation.mutate({
			id: editingGoal,
			data: {
				title: editTitle.trim(),
				description: editDescription.trim() || undefined,
			},
		})
	}

	const handleCancelEdit = () => {
		setEditingGoal(null)
		setEditTitle("")
		setEditDescription("")
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleAddGoal()
		}
	}

	return (
		<DashboardPage title="Goals" subtitle="Track your self-improvement goals and progress">
			{/* Add New Goal */}
			<Card className="mb-6">
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<Plus className="h-5 w-5 text-blue-500" />
						<span>Add New Goal</span>
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<label htmlFor="new-goal-input" className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
							Goal Title
						</label>
						<Input
							id="new-goal-input"
							placeholder="Enter your goal title..."
							value={newGoalTitle}
							onChange={(e) => setNewGoalTitle(e.target.value)}
							onKeyDown={handleKeyDown}
							disabled={isAdding}
						/>
					</div>
					<div>
						<label
							htmlFor="new-goal-description"
							className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300"
						>
							Description (optional)
						</label>
						<Textarea
							id="new-goal-description"
							placeholder="Describe what you want to achieve and why..."
							value={newGoalDescription}
							onChange={(e) => setNewGoalDescription(e.target.value)}
							disabled={isAdding}
							rows={3}
						/>
					</div>
					<div className="flex gap-2">
						<Button onClick={handleAddGoal} disabled={!newGoalTitle.trim() || isAdding}>
							<Plus className="mr-2 h-4 w-4" />
							Add Goal
						</Button>
						<Button
							variant="outline"
							className="border-blue-600 text-blue-600 hover:bg-blue-50"
							disabled={!newGoalTitle.trim() || isAdding}
						>
							<Brain className="mr-2 h-4 w-4" />
							Get AI Help
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Active Goals */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{goals.map((goal) => (
					<Card key={goal.id} className="relative">
						<CardHeader>
							<div className="flex items-start justify-between">
								<div className="flex flex-1 items-center space-x-2">
									<Target className="h-5 w-5 flex-shrink-0 text-blue-600" />
									{editingGoal === goal.id ? (
										<div className="flex-1 space-y-2">
											<Input
												value={editTitle}
												onChange={(e) => setEditTitle(e.target.value)}
												className="font-semibold text-lg"
												placeholder="Goal title"
											/>
										</div>
									) : (
										<CardTitle className="text-lg">{goal.title}</CardTitle>
									)}
								</div>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
											<MoreVertical className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem onClick={() => handleStartEdit(goal)}>
											<Edit className="mr-2 h-4 w-4" />
											Edit
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => handleDeleteGoal(goal.id)}
											className="text-red-600 hover:text-red-700"
										>
											<Trash2 className="mr-2 h-4 w-4" />
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</CardHeader>
						<CardContent>
							{editingGoal === goal.id ? (
								<div className="space-y-4">
									<div>
										<label
											htmlFor={`edit-description-${goal.id}`}
											className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300"
										>
											Description
										</label>
										<Textarea
											id={`edit-description-${goal.id}`}
											value={editDescription}
											onChange={(e) => setEditDescription(e.target.value)}
											placeholder="Describe what you want to achieve..."
											rows={3}
										/>
									</div>
									<div className="flex gap-2">
										<Button size="sm" onClick={handleUpdateGoal}>
											<CheckCircle className="mr-2 h-4 w-4" />
											Save
										</Button>
										<Button size="sm" variant="outline" onClick={handleCancelEdit}>
											Cancel
										</Button>
									</div>
								</div>
							) : (
								<div className="space-y-4">
									{goal.description && <p className="text-gray-600 text-sm dark:text-gray-400">{goal.description}</p>}
									<div className="space-y-3">
										<div className="text-gray-500 text-xs dark:text-gray-400">
											Created {new Date(goal.createdAt).toLocaleDateString()}
										</div>
										<Button
											variant="outline"
											size="sm"
											className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
										>
											<Brain className="mr-2 h-4 w-4" />
											Get AI Suggestions
										</Button>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				))}

				{/* Empty state when no goals exist */}
				{goals.length === 0 && (
					<div className="col-span-full py-12 text-center">
						<Target className="mx-auto mb-4 h-16 w-16 text-gray-400" />
						<h3 className="mb-2 font-medium text-gray-900 text-lg dark:text-gray-100">No goals yet</h3>
						<p className="mb-4 text-gray-500 text-sm dark:text-gray-400">
							Start your self-improvement journey by creating your first goal
						</p>
						<p className="text-gray-400 text-xs dark:text-gray-500">Add a goal above to begin tracking your progress</p>
					</div>
				)}
			</div>
		</DashboardPage>
	)
}
