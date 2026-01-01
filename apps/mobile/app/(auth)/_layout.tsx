import { Redirect, Stack } from "expo-router"
import { authClient } from "@/lib/auth-client"

export default function AuthLayout() {
	const { data: session } = authClient.useSession()

	if (session) {
		return <Redirect href="/(dashboard)" />
	}

	return <Stack screenOptions={{ headerShown: false }} />
}
