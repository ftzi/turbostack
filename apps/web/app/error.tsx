"use client"

import { Button } from "@workspace/ui/components/button"
import { RefreshCw } from "lucide-react"

export default function ErrorPage({
	reset,
}: {
	error: globalThis.Error & { digest?: string }
	reset: () => void
}): React.ReactElement {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center px-4">
			<div className="text-center">
				<p className="font-semibold text-destructive text-sm">Error</p>
				<h1 className="mt-2 font-bold text-3xl tracking-tight sm:text-5xl">Something went wrong</h1>
				<p className="mt-4 text-muted-foreground">
					An unexpected error occurred. Please try again or contact support if the problem persists.
				</p>
				<div className="mt-8">
					<Button onClick={reset}>
						<RefreshCw className="size-4" />
						Try again
					</Button>
				</div>
			</div>
		</div>
	)
}
