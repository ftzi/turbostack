import { Brain } from "lucide-react"
import { DashboardPage } from "@/components/dashboard-page"

export default function MindsetPage() {
	return (
		<DashboardPage title="Mindset" subtitle="Track your mindset and mental attitudes">
			<div className="flex flex-col items-center justify-center py-16">
				<Brain className="mb-4 h-16 w-16 text-gray-400 dark:text-gray-600" />
				<p className="text-gray-600 text-lg dark:text-gray-400">Mindset tracking coming soon</p>
			</div>
		</DashboardPage>
	)
}
