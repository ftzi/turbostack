import { Moon } from "lucide-react"
import { DashboardPage } from "@/components/dashboard-page"

export default function SleepPage() {
	return (
		<DashboardPage title="Sleep" subtitle="Track your sleep patterns and quality">
			<div className="flex flex-col items-center justify-center py-16">
				<Moon className="mb-4 h-16 w-16 text-gray-400 dark:text-gray-600" />
				<p className="text-gray-600 text-lg dark:text-gray-400">Sleep tracking coming soon</p>
			</div>
		</DashboardPage>
	)
}
