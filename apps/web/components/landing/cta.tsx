import { Button } from "@workspace/ui/components/button"
import { Container } from "@workspace/ui/components/container"
import { Section } from "@workspace/ui/components/section"
import { ArrowRight } from "lucide-react"

export function CTA() {
	return (
		<Section background="accent">
			<Container>
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">Ready to transform your life?</h2>
					<p className="mt-4 text-lg text-primary-foreground/80">
						Join thousands using AI-powered coaching to build better habits and achieve their goals.
					</p>
					<div className="mt-8">
						<Button size="lg" variant="secondary" asChild>
							<a href={process.env.NEXT_PUBLIC_APP_URL || "http://localhost:8081"}>
								Start Your Journey Free
								<ArrowRight className="size-4" />
							</a>
						</Button>
					</div>
				</div>
			</Container>
		</Section>
	)
}
