import { CreditCard } from "lucide-react"
import { DashboardPage } from "@/components/dashboard-page"

export default function PurchasesPage() {
	return (
		<DashboardPage title="Purchases" subtitle="Track your purchases and spending">
			<div className="flex flex-col items-center justify-center py-16">
				<CreditCard className="mb-4 h-16 w-16 text-gray-400 dark:text-gray-600" />
				<p className="text-gray-600 text-lg dark:text-gray-400">Purchase tracking coming soon</p>
			</div>
		</DashboardPage>
	)
}
