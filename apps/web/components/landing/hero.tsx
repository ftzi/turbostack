import { Button } from "@workspace/ui/components/button"
import { Container } from "@workspace/ui/components/container"
import { Section } from "@workspace/ui/components/section"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
	return (
		<Section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-28">
			<Container>
				<div className="mx-auto max-w-3xl text-center">
					<div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
						<Sparkles className="size-4 text-primary" />
						<span>AI-powered self-improvement</span>
					</div>

					<h1 className="font-bold text-4xl tracking-tight sm:text-5xl lg:text-6xl">
						Track your habits{" "}
						<span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
							achieve your goals
						</span>
					</h1>

					<p className="mt-6 text-lg text-muted-foreground sm:text-xl">
						Transform your life with personalized AI coaching, smart habit tracking, and holistic wellness insights.
						Become the best version of yourself.
					</p>

					<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Button size="lg" asChild>
							<a href={process.env.NEXT_PUBLIC_APP_URL || "http://localhost:8081"}>
								Start Your Journey
								<ArrowRight className="size-4" />
							</a>
						</Button>
						<Button size="lg" variant="outline" asChild>
							<a href="#features">Learn More</a>
						</Button>
					</div>
				</div>
			</Container>

			<div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute top-1/4 left-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
				<div className="absolute top-3/4 right-0 size-[400px] -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
			</div>
		</Section>
	)
}
