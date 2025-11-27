import { Button } from "@workspace/ui/components/button"
import { Container } from "@workspace/ui/components/container"
import { Section } from "@workspace/ui/components/section"
import { ArrowRight } from "lucide-react"

export function CTA() {
	return (
		<Section background="accent">
			<Container>
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">Ready to get started?</h2>
					<p className="mt-4 text-lg text-primary-foreground/80">
						Clone the repo, run one command, and start building your next big thing.
					</p>
					<div className="mt-8">
						<Button size="lg" variant="secondary" asChild>
							<a href="/app">
								Start Building Now
								<ArrowRight className="size-4" />
							</a>
						</Button>
					</div>
				</div>
			</Container>
		</Section>
	)
}
