import { Apple } from "lucide-react"
import { DashboardPage } from "@/components/dashboard-page"

export default function NutritionPage() {
	return (
		<DashboardPage title="Nutrition" subtitle="Track your meals and nutritional intake">
			<div className="flex flex-col items-center justify-center py-16">
				<Apple className="mb-4 h-16 w-16 text-gray-400 dark:text-gray-600" />
				<p className="text-gray-600 text-lg dark:text-gray-400">Nutrition tracking coming soon</p>
			</div>
		</DashboardPage>
	)
}
