import { consts } from "@workspace/shared/consts"
import { Button } from "@workspace/ui/components/button"
import { Footer, type FooterColumn, type SocialLink } from "@workspace/ui/components/footer"
import { Header, type NavLink } from "@workspace/ui/components/header"
import { Logo } from "@workspace/ui/components/logo"

const navLinks: NavLink[] = [
	{ href: "#features", label: "Features" },
	{ href: "#testimonials", label: "Testimonials" },
	{ href: "/privacy", label: "Privacy" },
	{ href: "/terms", label: "Terms" },
]

const footerColumns: FooterColumn[] = [
	{
		title: "Product",
		links: [
			{ href: "#features", label: "Features" },
			{ href: "#testimonials", label: "Testimonials" },
			{ href: "/app", label: "Get Started" },
		],
	},
	{
		title: "Legal",
		links: [
			{ href: "/privacy", label: "Privacy Policy" },
			{ href: "/terms", label: "Terms of Service" },
		],
	},
]

const socialLinks: SocialLink[] = [
	{ href: "https://github.com", icon: "github", label: "GitHub" },
	{ href: "https://twitter.com", icon: "twitter", label: "Twitter" },
]

export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>): React.ReactElement {
	return (
		<div className="flex min-h-svh flex-col">
			<Header
				logo={<Logo />}
				links={navLinks}
				sticky={consts.stickyHeader}
				actions={
					<Button asChild>
						<a href="/app">Get Started</a>
					</Button>
				}
			/>
			<main className="flex-1">{children}</main>
			<Footer logo={<Logo />} columns={footerColumns} socialLinks={socialLinks} />
		</div>
	)
}
