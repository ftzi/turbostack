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

type SignUpFormProps = {
	onSignInPress?: () => void
}

export function SignUpForm({ onSignInPress }: SignUpFormProps) {
	const [name, setName] = React.useState("")
	const [email, setEmail] = React.useState("")
	const [password, setPassword] = React.useState("")
	const [isLoading, setIsLoading] = React.useState(false)
	const emailInputRef = React.useRef<TextInput>(null)
	const passwordInputRef = React.useRef<TextInput>(null)

	function onNameSubmitEditing() {
		emailInputRef.current?.focus()
	}

	function onEmailSubmitEditing() {
		passwordInputRef.current?.focus()
	}

	async function onSubmit() {
		if (!(name && email && password)) {
			Alert.alert("Error", "Please fill in all fields")
			return
		}

		if (password.length < 8) {
			Alert.alert("Error", "Password must be at least 8 characters")
			return
		}

		setIsLoading(true)

		try {
			const { error } = await authClient.signUp.email({
				email,
				password,
				name,
			})

			if (error) {
				Alert.alert("Sign Up Failed", error.message || "An error occurred")
				return
			}

			router.replace("/(dashboard)")
		} catch (error) {
			const message = getErrorMessage(error, "Sign up failed")
			Alert.alert("Error", message)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<View className="gap-6">
			<Card className="border-border/0 shadow-none sm:border-border sm:shadow-black/5 sm:shadow-sm">
				<CardHeader>
					<CardTitle className="text-center text-xl sm:text-left">Create your account</CardTitle>
					<CardDescription className="text-center sm:text-left">
						Welcome! Please fill in the details to get started.
					</CardDescription>
				</CardHeader>
				<CardContent className="gap-6">
					<View className="gap-6">
						<View className="gap-1.5">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								placeholder="Your name"
								value={name}
								onChangeText={setName}
								autoCapitalize="words"
								autoComplete="name"
								editable={!isLoading}
								onSubmitEditing={onNameSubmitEditing}
								returnKeyType="next"
								submitBehavior="submit"
							/>
						</View>
						<View className="gap-1.5">
							<Label htmlFor="email">Email</Label>
							<Input
								ref={emailInputRef}
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
							</View>
							<Input
								ref={passwordInputRef}
								id="password"
								value={password}
								onChangeText={setPassword}
								secureTextEntry
								autoComplete="password-new"
								editable={!isLoading}
								returnKeyType="send"
								onSubmitEditing={onSubmit}
							/>
							<Text className="text-muted-foreground text-xs">Minimum 8 characters</Text>
						</View>
						<Button className="w-full" onPress={onSubmit} disabled={isLoading}>
							<Text>{isLoading ? "Creating account..." : "Continue"}</Text>
						</Button>
					</View>
					<Text className="text-center text-sm">
						Already have an account?{" "}
						<Pressable
							disabled={isLoading}
							onPress={() => {
								if (onSignInPress) {
									onSignInPress()
								} else {
									router.push("/(auth)/sign-in")
								}
							}}
						>
							<Text className="text-sm underline underline-offset-4">Sign in</Text>
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
