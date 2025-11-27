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
						<span>Ship faster with modern tools</span>
					</div>

					<h1 className="font-bold text-4xl tracking-tight sm:text-5xl lg:text-6xl">
						Build amazing products{" "}
						<span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
							with confidence
						</span>
					</h1>

					<p className="mt-6 text-lg text-muted-foreground sm:text-xl">
						A production-ready template with everything you need to build, ship, and scale your next big idea.
						Authentication, database, API, and beautiful UI included.
					</p>

					<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Button size="lg" asChild>
							<a href="/app">
								Get Started
								<ArrowRight className="size-4" />
							</a>
						</Button>
						<Button size="lg" variant="outline" asChild>
							<a href="https://github.com" target="_blank" rel="noopener noreferrer">
								View on GitHub
							</a>
						</Button>
					</div>
				</div>
			</Container>

			<div className="-z-10 pointer-events-none absolute inset-0 overflow-hidden">
				<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/4 left-1/2 size-[600px] rounded-full bg-primary/5 blur-3xl" />
				<div className="-translate-y-1/2 absolute top-3/4 right-0 size-[400px] rounded-full bg-primary/10 blur-3xl" />
			</div>
		</Section>
	)
}
