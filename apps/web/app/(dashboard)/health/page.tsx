import { Stethoscope } from "lucide-react"
import { DashboardPage } from "@/components/dashboard-page"

export default function HealthPage() {
	return (
		<DashboardPage title="Health" subtitle="Monitor your overall health and wellness">
			<div className="flex flex-col items-center justify-center py-16">
				<Stethoscope className="mb-4 h-16 w-16 text-gray-400 dark:text-gray-600" />
				<p className="text-gray-600 text-lg dark:text-gray-400">Health tracking coming soon</p>
			</div>
		</DashboardPage>
	)
}
