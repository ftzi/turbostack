import { Zap } from "lucide-react"
import { DashboardPage } from "@/components/dashboard-page"

export default function MindPage() {
	return (
		<DashboardPage title="Mind" subtitle="Track your mental wellness and mindfulness">
			<div className="flex flex-col items-center justify-center py-16">
				<Zap className="mb-4 h-16 w-16 text-gray-400 dark:text-gray-600" />
				<p className="text-gray-600 text-lg dark:text-gray-400">Mental wellness tracking coming soon</p>
			</div>
		</DashboardPage>
	)
}
