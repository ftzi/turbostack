import { KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { SignInForm } from "@/components/sign-in-form"

export default function SignIn() {
	return (
		<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
			<ScrollView className="flex-1 bg-background" contentContainerClassName="min-h-screen justify-center p-6">
				<SignInForm />
			</ScrollView>
		</KeyboardAvoidingView>
	)
}
