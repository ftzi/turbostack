import { router } from "expo-router"
import { ScrollView, View } from "react-native"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { authClient } from "@/lib/auth-client"

export default function More() {
	const handleSignOut = async () => {
		await authClient.signOut()
		// Navigate to root - will redirect to sign-in since session is cleared
		router.replace("/")
	}

	return (
		<ScrollView className="flex-1 bg-background">
			<View className="gap-6 p-4">
				<View className="gap-2">
					<Text className="font-bold text-2xl">More</Text>
					<Text className="text-muted-foreground">Settings and additional options</Text>
				</View>

				<View className="gap-4">
					<Text className="font-semibold text-lg">Wellness Categories</Text>
					<Text className="text-muted-foreground text-sm">Navigation to wellness pages - Coming soon</Text>
				</View>

				<View className="gap-4">
					<Text className="font-semibold text-lg">Account</Text>
					<Button onPress={handleSignOut} variant="destructive">
						<Text>Sign out</Text>
					</Button>
				</View>
			</View>
		</ScrollView>
	)
}
