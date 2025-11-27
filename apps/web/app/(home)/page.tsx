import { CTA } from "@/components/landing/cta"
import { Features } from "@/components/landing/features"
import { Hero } from "@/components/landing/hero"
import { Testimonials } from "@/components/landing/testimonials"

export default function Page(): React.ReactElement {
	return (
		<>
			<Hero />
			<div id="features">
				<Features />
			</div>
			<div id="testimonials">
				<Testimonials />
			</div>
			<CTA />
		</>
	)
}
