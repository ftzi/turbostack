"use client"

import { useSelectedLayoutSegment } from "next/navigation"
import type { ReactNode } from "react"
import { Providers } from "./providers"

type RootLayoutWrapperProps = {
	children: ReactNode
	fontClasses: string
}

/**
 * Wrapper component for the root layout that skips providers for Nextbook routes.
 *
 * When the first segment is 'ui', it returns only the children without
 * html/body/providers, allowing the ui/layout.tsx to provide its own.
 *
 * Reference: https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segment
 */
export function RootLayoutWrapper({ children, fontClasses }: RootLayoutWrapperProps) {
	const segment = useSelectedLayoutSegment()

	// Skip wrapper for Nextbook routes - ui/layout.tsx provides its own html/body
	if (segment === "ui") {
		return <>{children}</>
	}

	// Normal app routes - render with full html/body/providers
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${fontClasses} font-sans antialiased`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
