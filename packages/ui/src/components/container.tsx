import { cn } from "@workspace/ui/lib/utils"
import type * as React from "react"

function Container({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div data-slot="container" className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props} />
	)
}

export { Container }
