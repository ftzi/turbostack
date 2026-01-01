import { Redirect, Tabs } from "expo-router"
import { Calendar, CheckSquare, Home, Menu, Target } from "lucide-react-native"
import { authClient } from "@/lib/auth-client"

export default function DashboardLayout() {
	const { data: session } = authClient.useSession()

	if (!session) {
		return <Redirect href="/(auth)/sign-in" />
	}

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: "#3b82f6",
				tabBarInactiveTintColor: "#6b7280",
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Dashboard",
					tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
				}}
			/>
			<Tabs.Screen
				name="tasks"
				options={{
					title: "Tasks",
					tabBarIcon: ({ color, size }) => <CheckSquare color={color} size={size} />,
				}}
			/>
			<Tabs.Screen
				name="calendar"
				options={{
					title: "Calendar",
					tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
				}}
			/>
			<Tabs.Screen
				name="goals"
				options={{
					title: "Goals",
					tabBarIcon: ({ color, size }) => <Target color={color} size={size} />,
				}}
			/>
			<Tabs.Screen
				name="more"
				options={{
					title: "More",
					tabBarIcon: ({ color, size }) => <Menu color={color} size={size} />,
				}}
			/>
		</Tabs>
	)
}
