"use client"

import type { User } from "@workspace/api/auth"
import { Button } from "@workspace/ui/components/button"
import { Logo } from "@workspace/ui/components/logo"
import { LogoIcon } from "@workspace/ui/components/logo-icon"
import { MobileNav, MobileNavContent, MobileNavLink, MobileNavTrigger } from "@workspace/ui/components/mobile-nav"
import { Separator } from "@workspace/ui/components/separator"
import { cn } from "@workspace/ui/lib/utils"
import { LayoutDashboard, LogOut, Menu, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { authClient } from "@/lib/auth-client"

type AdminSidebarProps = {
	user: User
}

const navItems = [
	{ href: "/admin", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/admin/users", label: "Users", icon: Users },
]

export function AdminSidebar({ user }: AdminSidebarProps): React.ReactElement {
	const pathname = usePathname()

	const handleLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.href = "/"
				},
			},
		})
	}

	return (
		<>
			{/* Desktop Sidebar */}
			<aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r bg-background lg:flex">
				<div className="flex h-16 items-center border-b px-6">
					<Link href="/admin" className="flex items-center gap-2">
						<Logo />
					</Link>
				</div>

				<nav className="flex-1 space-y-1 p-4">
					{navItems.map((item) => {
						const isActive = pathname === item.href
						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"flex items-center gap-3 rounded-md px-3 py-2 font-medium text-sm transition-colors",
									isActive
										? "bg-accent text-accent-foreground"
										: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
								)}
							>
								<item.icon className="size-4" />
								{item.label}
							</Link>
						)
					})}
				</nav>

				<div className="border-t p-4">
					<div className="mb-3 flex items-center gap-3 px-3">
						<div className="size-8 rounded-full bg-muted" />
						<div className="flex-1 truncate">
							<p className="truncate font-medium text-sm">{user.name}</p>
							<p className="truncate text-muted-foreground text-xs">{user.email}</p>
						</div>
					</div>
					<Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
						<LogOut className="size-4" />
						Logout
					</Button>
				</div>
			</aside>

			{/* Mobile Header */}
			<header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 lg:hidden">
				<Link href="/admin" className="flex items-center gap-2">
					<LogoIcon className="size-8" />
				</Link>

				<MobileNav>
					<MobileNavTrigger>
						<Menu className="size-6" />
						<span className="sr-only">Open menu</span>
					</MobileNavTrigger>
					<MobileNavContent>
						<div className="mb-4 flex items-center gap-3 px-3">
							<div className="size-8 rounded-full bg-muted" />
							<div className="flex-1 truncate">
								<p className="truncate font-medium text-sm">{user.name}</p>
								<p className="truncate text-muted-foreground text-xs">{user.email}</p>
							</div>
						</div>
						<Separator className="mb-4" />
						{navItems.map((item) => {
							const isActive = pathname === item.href
							return (
								<MobileNavLink
									key={item.href}
									href={item.href}
									className={cn(isActive && "bg-accent text-accent-foreground")}
								>
									<item.icon className="mr-3 size-4" />
									{item.label}
								</MobileNavLink>
							)
						})}
						<Separator className="my-4" />
						<Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
							<LogOut className="size-4" />
							Logout
						</Button>
					</MobileNavContent>
				</MobileNav>
			</header>

			{/* Mobile content offset */}
			<div className="h-16 lg:hidden" />
		</>
	)
}
