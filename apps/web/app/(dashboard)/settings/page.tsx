import { Settings } from "lucide-react"
import { DashboardPage } from "@/components/dashboard-page"

export default function SettingsPage() {
	return (
		<DashboardPage title="Settings" subtitle="Manage your account and preferences">
			<div className="flex flex-col items-center justify-center py-16">
				<Settings className="mb-4 h-16 w-16 text-gray-400 dark:text-gray-600" />
				<p className="text-gray-600 text-lg dark:text-gray-400">Settings coming soon</p>
			</div>
		</DashboardPage>
	)
}
