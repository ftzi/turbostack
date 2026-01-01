import { Heart } from "lucide-react"
import { DashboardPage } from "@/components/dashboard-page"

export default function SelfEsteemPage() {
	return (
		<DashboardPage title="Self-Esteem" subtitle="Track your self-confidence and self-worth">
			<div className="flex flex-col items-center justify-center py-16">
				<Heart className="mb-4 h-16 w-16 text-gray-400 dark:text-gray-600" />
				<p className="text-gray-600 text-lg dark:text-gray-400">Self-esteem tracking coming soon</p>
			</div>
		</DashboardPage>
	)
}
