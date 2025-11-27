import { Container } from "@workspace/ui/components/container"
import { Section } from "@workspace/ui/components/section"

const testimonials = [
	{
		quote: "This template saved us weeks of setup time. We went from idea to production in days, not months.",
		author: "Sarah Chen",
		title: "CTO at TechStart",
	},
	{
		quote: "The code quality is exceptional. Type safety everywhere, great patterns, and easy to extend.",
		author: "Marcus Johnson",
		title: "Senior Developer",
	},
	{
		quote: "Finally, a template that doesn't require days of configuration. Just clone and start building.",
		author: "Emily Rodriguez",
		title: "Indie Hacker",
	},
]

export function Testimonials() {
	return (
		<Section>
			<Container>
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">Loved by developers</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Join hundreds of developers shipping faster with this template.
					</p>
				</div>

				<div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
					{testimonials.map((testimonial) => (
						<div key={testimonial.author} className="flex flex-col rounded-2xl border bg-background p-6">
							<blockquote className="flex-1">
								<p className="text-muted-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
							</blockquote>
							<div className="mt-6 border-t pt-4">
								<p className="font-semibold text-sm">{testimonial.author}</p>
								<p className="text-muted-foreground text-sm">{testimonial.title}</p>
							</div>
						</div>
					))}
				</div>
			</Container>
		</Section>
	)
}
