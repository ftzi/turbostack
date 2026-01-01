import { Image, Platform, View } from "react-native"
import { useUniwind } from "uniwind"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const SOCIAL_CONNECTION_STRATEGIES = [
	{
		type: "oauth_apple",
		source: { uri: "https://img.clerk.com/static/apple.png?width=160" },
		useTint: true,
	},
	{
		type: "oauth_google",
		source: { uri: "https://img.clerk.com/static/google.png?width=160" },
		useTint: false,
	},
	{
		type: "oauth_github",
		source: { uri: "https://img.clerk.com/static/github.png?width=160" },
		useTint: true,
	},
]

export function SocialConnections() {
	const { theme } = useUniwind()

	return (
		<View className="gap-2 sm:flex-row sm:gap-3">
			{SOCIAL_CONNECTION_STRATEGIES.map((strategy) => {
				let tintColor: string | undefined
				if (strategy.useTint) {
					tintColor = theme === "dark" ? "white" : "black"
				}

				return (
					<Button
						key={strategy.type}
						variant="outline"
						size="sm"
						className="sm:flex-1"
						onPress={() => {
							// TODO: Authenticate with social provider and navigate to protected screen if successful
						}}
					>
						<Image
							className={cn("size-4", strategy.useTint && Platform.select({ web: "dark:invert" }))}
							tintColor={Platform.select({ native: tintColor })}
							source={strategy.source}
						/>
					</Button>
				)
			})}
		</View>
	)
}
