import { Users } from "lucide-react"
import { DashboardPage } from "@/components/dashboard-page"

export default function SocialPage() {
	return (
		<DashboardPage title="Social" subtitle="Track your social interactions and relationships">
			<div className="flex flex-col items-center justify-center py-16">
				<Users className="mb-4 h-16 w-16 text-gray-400 dark:text-gray-600" />
				<p className="text-gray-600 text-lg dark:text-gray-400">Social tracking coming soon</p>
			</div>
		</DashboardPage>
	)
}
