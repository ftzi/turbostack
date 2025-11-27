import { Container } from "@workspace/ui/components/container"
import { Section } from "@workspace/ui/components/section"
import { Database, Lock, Palette, Rocket, Server, Zap } from "lucide-react"

const features = [
	{
		icon: Lock,
		title: "Authentication Ready",
		description:
			"Better Auth configured with social logins, email verification, and session management out of the box.",
	},
	{
		icon: Database,
		title: "Database Included",
		description: "Drizzle ORM with Neon PostgreSQL. Type-safe queries, migrations, and a beautiful studio interface.",
	},
	{
		icon: Server,
		title: "Type-Safe API",
		description: "oRPC for end-to-end type safety. Define once, use everywhere with full IntelliSense support.",
	},
	{
		icon: Palette,
		title: "Beautiful UI",
		description: "shadcn/ui components with Radix primitives. Accessible, customizable, and ready for dark mode.",
	},
	{
		icon: Zap,
		title: "Lightning Fast",
		description: "Turborepo for blazing builds, Bun for speedy installs, and Next.js 16 with React Compiler.",
	},
	{
		icon: Rocket,
		title: "Deploy Anywhere",
		description: "Optimized for Vercel but works anywhere. Environment variables managed with type safety.",
	},
]

export function Features() {
	return (
		<Section background="muted">
			<Container>
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">Everything you need to ship</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Stop wasting time on boilerplate. Start building what makes your product unique.
					</p>
				</div>

				<div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{features.map((feature) => (
						<div
							key={feature.title}
							className="group relative rounded-2xl border bg-background p-6 transition-shadow hover:shadow-lg"
						>
							<div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
								<feature.icon className="size-6 text-primary" />
							</div>
							<h3 className="font-semibold text-lg">{feature.title}</h3>
							<p className="mt-2 text-muted-foreground text-sm">{feature.description}</p>
						</div>
					))}
				</div>
			</Container>
		</Section>
	)
}
