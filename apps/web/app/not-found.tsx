import { Button } from "@workspace/ui/components/button"
import { ArrowLeft } from "lucide-react"

export default function NotFound(): React.ReactElement {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center px-4">
			<div className="text-center">
				<p className="font-semibold text-primary text-sm">404</p>
				<h1 className="mt-2 font-bold text-3xl tracking-tight sm:text-5xl">Page not found</h1>
				<p className="mt-4 text-muted-foreground">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
				<div className="mt-8">
					<Button asChild>
						<a href="/">
							<ArrowLeft className="size-4" />
							Back to home
						</a>
					</Button>
				</div>
			</div>
		</div>
	)
}
