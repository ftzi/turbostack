import "@/global.css"

import { ThemeProvider } from "@react-navigation/native"
import { PortalHost } from "@rn-primitives/portal"
import { QueryClientProvider } from "@tanstack/react-query"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useColorScheme } from "nativewind"
import { createQueryClient } from "@/lib/query"
import { NAV_THEME } from "@/lib/theme"

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router"

const queryClient = createQueryClient()

export default function RootLayout() {
	const { colorScheme } = useColorScheme()

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
				<StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
				<Stack screenOptions={{ headerShown: false }} />
				<PortalHost />
			</ThemeProvider>
		</QueryClientProvider>
	)
}
