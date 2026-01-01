import type { ReactNode } from "react"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"

export default function DashboardLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex h-screen overflow-hidden">
			<DashboardSidebar />
			<main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">{children}</main>
		</div>
	)
}
