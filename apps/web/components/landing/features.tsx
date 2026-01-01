import { Container } from "@workspace/ui/components/container"
import { Section } from "@workspace/ui/components/section"
import { Brain, Calendar, Heart, Target, TrendingUp, Zap } from "lucide-react"

const features = [
	{
		icon: Brain,
		title: "AI Life Coach",
		description:
			"Get personalized recommendations, insights, and motivation tailored to your unique personality and goals.",
	},
	{
		icon: Target,
		title: "Smart Goal Setting",
		description:
			"Define meaningful goals and receive AI-powered action plans that adapt to your progress and life changes.",
	},
	{
		icon: Heart,
		title: "Holistic Wellness",
		description:
			"Track nutrition, exercise, sleep, and mental health with integrated insights that show how everything connects.",
	},
	{
		icon: Calendar,
		title: "Smart Scheduling",
		description: "AI-powered time blocking that optimizes your schedule based on energy patterns and priorities.",
	},
	{
		icon: TrendingUp,
		title: "Progress Analytics",
		description: "Visualize your growth with detailed analytics that reveal patterns and celebrate your achievements.",
	},
	{
		icon: Zap,
		title: "Privacy First",
		description:
			"Your data stays yours. Anonymous tracking, encrypted storage, and complete control over your information.",
	},
]

export function Features() {
	return (
		<Section background="muted">
			<Container>
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">Everything You Need to Thrive</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Habbits combines cutting-edge AI with proven self-improvement methodologies to create your personal growth
						companion.
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
