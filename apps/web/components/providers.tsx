"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type * as React from "react"
import { useState } from "react"
import { createQueryClient } from "@/lib/query"

/**
 * Root providers for the application
 * Reference: https://orpc.unnoq.com/docs/integrations/tanstack-query
 */
export function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(() => createQueryClient())

	return (
		<QueryClientProvider client={queryClient}>
			<NextThemesProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
				enableColorScheme
			>
				{children}
			</NextThemesProvider>
		</QueryClientProvider>
	)
}
