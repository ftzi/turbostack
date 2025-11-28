import { auth } from "@workspace/api/auth"
import { headers } from "next/headers"

export default async function AdminDashboardPage(): Promise<React.ReactElement> {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	return (
		<div className="p-6 lg:p-8">
			<div className="mb-8">
				<h1 className="font-bold text-2xl tracking-tight">Dashboard</h1>
				<p className="text-muted-foreground">Welcome back, {session?.user?.name}</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<div className="rounded-lg border bg-card p-6">
					<h3 className="font-medium text-muted-foreground text-sm">Overview</h3>
					<p className="mt-2 text-muted-foreground text-sm">
						This is your admin dashboard. Use the sidebar to navigate to different sections.
					</p>
				</div>
			</div>
		</div>
	)
}
