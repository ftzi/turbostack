import type { ReactNode } from "react"
import { ScrollView, View } from "react-native"

type AuthScreenWrapperProps = {
	children: ReactNode
}

/**
 * Standard wrapper for authentication screens following React Native Reusables pattern.
 * Reference: https://reactnativereusables.com/docs/blocks/authentication
 *
 * Features:
 * - Responsive layout (mobile and desktop optimized)
 * - Keyboard handling (dismissible, persists taps)
 * - Safe area insets
 * - Constrained max width for better UX
 */
export function AuthScreenWrapper({ children }: AuthScreenWrapperProps) {
	return (
		<ScrollView
			keyboardShouldPersistTaps="handled"
			contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6 mt-safe"
			keyboardDismissMode="interactive"
		>
			<View className="w-full max-w-sm">{children}</View>
		</ScrollView>
	)
}
