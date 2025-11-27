import { cn } from "@workspace/ui/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"

const sectionVariants = cva("py-16 sm:py-20 lg:py-24", {
	variants: {
		background: {
			default: "bg-background",
			muted: "bg-muted/50",
			accent: "bg-primary text-primary-foreground",
		},
	},
	defaultVariants: {
		background: "default",
	},
})

function Section({
	className,
	background,
	...props
}: React.ComponentProps<"section"> & VariantProps<typeof sectionVariants>) {
	return <section data-slot="section" className={cn(sectionVariants({ background, className }))} {...props} />
}

export { Section, sectionVariants }
