import { getErrorMessage } from "@workspace/shared/utils/error"
import { router } from "expo-router"
import * as React from "react"
import { Alert, Pressable, type TextInput, View } from "react-native"
import { SocialConnections } from "@/components/social-connections"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Text } from "@/components/ui/text"
import { authClient } from "@/lib/auth-client"

type SignInFormProps = {
	onSignUpPress?: () => void
}

export function SignInForm({ onSignUpPress }: SignInFormProps) {
	const [email, setEmail] = React.useState("")
	const [password, setPassword] = React.useState("")
	const [isLoading, setIsLoading] = React.useState(false)
	const passwordInputRef = React.useRef<TextInput>(null)

	function onEmailSubmitEditing() {
		passwordInputRef.current?.focus()
	}

	async function onSubmit() {
		if (!(email && password)) {
			Alert.alert("Error", "Please enter both email and password")
			return
		}

		setIsLoading(true)

		try {
			const { error } = await authClient.signIn.email({
				email,
				password,
			})

			if (error) {
				Alert.alert("Sign In Failed", error.message || "Invalid credentials")
				return
			}

			// Navigate to root - will redirect to dashboard if session is set
			router.replace("/")
		} catch (error) {
			const message = getErrorMessage(error, "Sign in failed")
			Alert.alert("Error", message)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<View className="gap-6">
			<Card className="border-border/0 shadow-none sm:border-border sm:shadow-black/5 sm:shadow-sm">
				<CardHeader>
					<CardTitle className="text-center text-xl sm:text-left">Sign in to your app</CardTitle>
					<CardDescription className="text-center sm:text-left">
						Welcome back! Please sign in to continue
					</CardDescription>
				</CardHeader>
				<CardContent className="gap-6">
					<View className="gap-6">
						<View className="gap-1.5">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								placeholder="m@example.com"
								value={email}
								onChangeText={setEmail}
								keyboardType="email-address"
								autoComplete="email"
								autoCapitalize="none"
								autoCorrect={false}
								editable={!isLoading}
								onSubmitEditing={onEmailSubmitEditing}
								returnKeyType="next"
								submitBehavior="submit"
							/>
						</View>
						<View className="gap-1.5">
							<View className="flex-row items-center">
								<Label htmlFor="password">Password</Label>
								<Button
									variant="link"
									size="sm"
									className="ml-auto h-4 web:h-fit px-1 py-0 sm:h-4"
									disabled={isLoading}
									onPress={() => {
										// TODO: Navigate to forgot password screen
									}}
								>
									<Text className="font-normal leading-4">Forgot your password?</Text>
								</Button>
							</View>
							<Input
								ref={passwordInputRef}
								id="password"
								value={password}
								onChangeText={setPassword}
								secureTextEntry
								autoComplete="password"
								editable={!isLoading}
								returnKeyType="send"
								onSubmitEditing={onSubmit}
							/>
						</View>
						<Button className="w-full" onPress={onSubmit} disabled={isLoading}>
							<Text>{isLoading ? "Signing in..." : "Continue"}</Text>
						</Button>
					</View>
					<Text className="text-center text-sm">
						Don&apos;t have an account?{" "}
						<Pressable
							disabled={isLoading}
							onPress={() => {
								if (onSignUpPress) {
									onSignUpPress()
								} else {
									router.push("/(auth)/sign-up")
								}
							}}
						>
							<Text className="text-sm underline underline-offset-4">Sign up</Text>
						</Pressable>
					</Text>
					<View className="flex-row items-center">
						<Separator className="flex-1" />
						<Text className="px-4 text-muted-foreground text-sm">or</Text>
						<Separator className="flex-1" />
					</View>
					<SocialConnections />
				</CardContent>
			</Card>
		</View>
	)
}
