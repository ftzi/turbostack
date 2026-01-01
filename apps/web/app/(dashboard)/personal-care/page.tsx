import { Scissors } from "lucide-react"
import { DashboardPage } from "@/components/dashboard-page"

export default function PersonalCarePage() {
	return (
		<DashboardPage title="Personal Care" subtitle="Track your self-care and grooming habits">
			<div className="flex flex-col items-center justify-center py-16">
				<Scissors className="mb-4 h-16 w-16 text-gray-400 dark:text-gray-600" />
				<p className="text-gray-600 text-lg dark:text-gray-400">Personal care tracking coming soon</p>
			</div>
		</DashboardPage>
	)
}
