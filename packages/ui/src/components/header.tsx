"use client"

import { Container } from "@workspace/ui/components/container"
import { MobileNav, MobileNavContent, MobileNavLink, MobileNavTrigger } from "@workspace/ui/components/mobile-nav"
import { cn } from "@workspace/ui/lib/utils"
import type * as React from "react"

type NavLink = {
	href: string
	label: string
}

type HeaderProps = React.ComponentProps<"header"> & {
	logo: React.ReactNode
	links?: NavLink[]
	sticky?: boolean
	actions?: React.ReactNode
}

function Header({ logo, links = [], sticky = true, actions, className, ...props }: HeaderProps) {
	return (
		<header
			data-slot="header"
			className={cn(
				"z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
				sticky && "sticky top-0",
				className,
			)}
			{...props}
		>
			<Container>
				<div className="flex h-16 items-center justify-between">
					<a href="/" className="flex items-center">
						{logo}
					</a>

					<nav className="hidden items-center gap-6 md:flex">
						{links.map((link) => (
							<a
								key={link.href}
								href={link.href}
								className="font-medium text-muted-foreground text-sm transition-colors hover:text-foreground"
							>
								{link.label}
							</a>
						))}
					</nav>

					<div className="flex items-center gap-2">
						<div className="hidden md:flex md:items-center md:gap-2">{actions}</div>
						<MobileNav>
							<MobileNavTrigger />
							<MobileNavContent>
								{links.map((link) => (
									<MobileNavLink key={link.href} href={link.href}>
										{link.label}
									</MobileNavLink>
								))}
								{actions && <div className="mt-4 flex flex-col gap-2 border-t pt-4">{actions}</div>}
							</MobileNavContent>
						</MobileNav>
					</div>
				</div>
			</Container>
		</header>
	)
}

export { Header }
export type { NavLink }
