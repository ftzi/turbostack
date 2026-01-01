"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Activity, Brain, CheckSquare, Target } from "lucide-react"
import { DashboardPage } from "@/components/dashboard-page"

export default function Dashboard() {
	return (
		<DashboardPage title="Dashboard" subtitle="Welcome to your self-improvement journey">
			{/* Quick Stats Grid */}
			<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center">
							<CheckSquare className="h-8 w-8 text-blue-600" />
							<div className="ml-4">
								<p className="font-medium text-gray-600 text-sm dark:text-gray-400">Tasks Today</p>
								<p className="font-bold text-2xl text-gray-900 dark:text-white">0</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center">
							<Target className="h-8 w-8 text-green-600" />
							<div className="ml-4">
								<p className="font-medium text-gray-600 text-sm dark:text-gray-400">Goals Active</p>
								<p className="font-bold text-2xl text-gray-900 dark:text-white">0</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center">
							<Activity className="h-8 w-8 text-red-600" />
							<div className="ml-4">
								<p className="font-medium text-gray-600 text-sm dark:text-gray-400">Health Score</p>
								<p className="font-bold text-2xl text-gray-900 dark:text-white">--</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-6">
						<div className="flex items-center">
							<Brain className="h-8 w-8 text-purple-600" />
							<div className="ml-4">
								<p className="font-medium text-gray-600 text-sm dark:text-gray-400">Mood</p>
								<p className="font-bold text-2xl text-gray-900 dark:text-white">--</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				{/* Today's Focus */}
				<Card>
					<CardHeader>
						<CardTitle>Today's Focus</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="py-8 text-center">
							<p className="text-gray-500 text-sm dark:text-gray-400">
								No focus items set for today. Add tasks or goals to see them here.
							</p>
						</div>
					</CardContent>
				</Card>

				{/* AI Coach Insights */}
				<Card>
					<CardHeader>
						<CardTitle>AI Coach Insights</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<p className="text-gray-600 text-sm dark:text-gray-400">
								"You've been consistent with your morning routine this week. Consider adding a 5-minute journaling
								session to enhance your mindfulness practice."
							</p>
							<div className="border-t pt-2">
								<p className="text-gray-500 text-xs dark:text-gray-500">
									Powered by your personal data and AI coaching
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</DashboardPage>
	)
}
