import { auth } from "@workspace/api/auth"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { AdminSidebar } from "./_components/admin-sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }): Promise<React.ReactElement> {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	// Return 404 for non-authenticated or non-admin users
	// This hides the existence of the admin interface
	if (!session?.user || session.user.role !== "admin") {
		notFound()
	}

	return (
		<div className="flex min-h-svh">
			<AdminSidebar user={session.user} />
			<main className="flex-1 lg:pl-64">{children}</main>
		</div>
	)
}
