import { Container } from "@workspace/ui/components/container"
import { cn } from "@workspace/ui/lib/utils"
import { Github, Twitter } from "lucide-react"
import type * as React from "react"

type FooterLink = {
	href: string
	label: string
}

type FooterColumn = {
	title: string
	links: FooterLink[]
}

type SocialLink = {
	href: string
	icon: "github" | "twitter"
	label: string
}

type FooterProps = React.ComponentProps<"footer"> & {
	logo: React.ReactNode
	columns?: FooterColumn[]
	socialLinks?: SocialLink[]
	copyright?: string
}

const socialIcons = {
	github: Github,
	twitter: Twitter,
}

function Footer({ logo, columns = [], socialLinks = [], copyright, className, ...props }: FooterProps) {
	const year = new Date().getFullYear()

	return (
		<footer data-slot="footer" className={cn("border-t bg-background", className)} {...props}>
			<Container>
				<div className="py-12 md:py-16">
					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
						<div className="space-y-4">
							<a href="/" className="inline-block">
								{logo}
							</a>
							{socialLinks.length > 0 && (
								<div className="flex gap-4">
									{socialLinks.map((link) => {
										const Icon = socialIcons[link.icon]
										return (
											<a
												key={link.href}
												href={link.href}
												target="_blank"
												rel="noopener noreferrer"
												className="text-muted-foreground transition-colors hover:text-foreground"
												aria-label={link.label}
											>
												<Icon className="size-5" />
											</a>
										)
									})}
								</div>
							)}
						</div>

						{columns.map((column) => (
							<div key={column.title}>
								<h3 className="mb-4 font-semibold text-sm">{column.title}</h3>
								<ul className="space-y-3">
									{column.links.map((link) => (
										<li key={link.href}>
											<a
												href={link.href}
												className="text-muted-foreground text-sm transition-colors hover:text-foreground"
											>
												{link.label}
											</a>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>

				<div className="border-t py-6">
					<p className="text-center text-muted-foreground text-sm">{copyright ?? `© ${year} All rights reserved.`}</p>
				</div>
			</Container>
		</footer>
	)
}

export { Footer }
export type { FooterColumn, FooterLink, SocialLink }
