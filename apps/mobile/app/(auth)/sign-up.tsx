import { KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { SignUpForm } from "@/components/sign-up-form"

export default function SignUp() {
	return (
		<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
			<ScrollView className="flex-1 bg-background" contentContainerClassName="min-h-screen justify-center p-6">
				<SignUpForm />
			</ScrollView>
		</KeyboardAvoidingView>
	)
}
