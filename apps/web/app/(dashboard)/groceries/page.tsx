import { ShoppingCart } from "lucide-react"
import { DashboardPage } from "@/components/dashboard-page"

export default function GroceriesPage() {
	return (
		<DashboardPage title="Groceries" subtitle="Track your grocery shopping and lists">
			<div className="flex flex-col items-center justify-center py-16">
				<ShoppingCart className="mb-4 h-16 w-16 text-gray-400 dark:text-gray-600" />
				<p className="text-gray-600 text-lg dark:text-gray-400">Grocery tracking coming soon</p>
			</div>
		</DashboardPage>
	)
}
