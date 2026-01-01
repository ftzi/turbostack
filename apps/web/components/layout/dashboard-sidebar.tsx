"use client"

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { ThemeToggleInline } from "@workspace/ui/components/theme-toggle"
import { cn } from "@workspace/ui/lib/utils"
import {
	Activity,
	Apple,
	Brain,
	Calendar,
	CheckSquare,
	CreditCard,
	Crown,
	Heart,
	Home,
	LogOut,
	Moon,
	PawPrint,
	Scissors,
	Settings,
	ShoppingCart,
	Stethoscope,
	Target,
	User,
	Users,
	Zap,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { authClient } from "@/lib/auth-client"

// Mock scoring function - in real app this would come from API/database
const getPageScore = (pageName: string): "perfect" | "good" | "none" => {
	// Mock scoring based on page name
	const perfectPages = ["Tasks", "Goals", "Nutrition"]
	const goodPages = ["Physical", "Health", "Mindset"]

	if (perfectPages.includes(pageName)) return "perfect"
	if (goodPages.includes(pageName)) return "good"
	return "none"
}

const navigation = [
	{ name: "Dashboard", href: "/dashboard", icon: Home },
	{ name: "Tasks", href: "/tasks", icon: CheckSquare },
	{ name: "Calendar", href: "/calendar", icon: Calendar },
	{ name: "Goals", href: "/goals", icon: Target },
	{ name: "Physical", href: "/physical", icon: Activity },
	{ name: "Nutrition", href: "/nutrition", icon: Apple },
	{ name: "Health", href: "/health", icon: Stethoscope },
	{ name: "Sleep", href: "/sleep", icon: Moon },
	{ name: "Mind", href: "/mind", icon: Zap },
	{ name: "Personal Care", href: "/personal-care", icon: Scissors },
	{ name: "Social", href: "/social", icon: Users },
	{ name: "Mindset", href: "/mindset", icon: Brain },
	{ name: "Self-Esteem", href: "/self-esteem", icon: Heart },
	{ name: "Pets", href: "/pets", icon: PawPrint },
	{ name: "Groceries", href: "/groceries", icon: ShoppingCart },
	{ name: "Purchases", href: "/purchases", icon: CreditCard },
]

export function DashboardSidebar() {
	const pathname = usePathname()
	const { data: session } = authClient.useSession()

	const handleSignOut = async () => {
		await authClient.signOut()
	}

	return (
		<div className="flex h-full w-64 flex-col border-gray-200 border-r bg-white dark:border-gray-700 dark:bg-gray-900">
			{/* Logo/Brand */}
			<div className="flex h-16 items-center border-gray-200 border-b px-6 dark:border-gray-700">
				<h1 className="font-bold text-gray-900 text-xl dark:text-white">Habbits</h1>
			</div>

			{/* Navigation */}
			<nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
				{navigation.map((item) => {
					const isActive = pathname === item.href
					const score = getPageScore(item.name)
					return (
						<Link
							key={item.name}
							href={item.href}
							className={cn(
								"group flex items-center justify-between rounded-md px-3 py-2 font-medium text-sm transition-colors",
								isActive
									? "border-blue-700 border-r-2 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/50 dark:text-blue-300"
									: "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
							)}
						>
							<div className="flex items-center">
								<item.icon
									className={cn(
										"mr-3 h-5 w-5 flex-shrink-0",
										isActive
											? "text-blue-700 dark:text-blue-300"
											: "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400",
									)}
								/>
								{item.name}
							</div>
							{/* Score indicator */}
							{score === "perfect" && <Crown className="h-4 w-4 flex-shrink-0 text-yellow-500" />}
							{score === "good" && <div className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500" />}
						</Link>
					)
				})}
			</nav>

			{/* User section at bottom */}
			<div className="border-gray-200 border-t p-4 dark:border-gray-700">
				<DropdownMenu>
					<DropdownMenuTrigger className="w-full">
						<div className="flex w-full items-center rounded-md p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
							<div className="flex-shrink-0">
								<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
									<User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
								</div>
							</div>
							<div className="ml-3 flex-1 text-left">
								<p className="font-medium text-gray-700 text-sm dark:text-gray-200">
									{session?.user?.name || "Anonymous User"}
								</p>
								<p className="text-gray-500 text-xs dark:text-gray-400">Privacy-first coaching</p>
							</div>
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="center" className="mb-2 w-56">
						<DropdownMenuItem asChild>
							<Link href="/settings" className="flex cursor-pointer items-center">
								<Settings className="mr-2 h-4 w-4" />
								Settings
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<ThemeToggleInline />
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
							<LogOut className="mr-2 h-4 w-4" />
							Sign out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	)
}
