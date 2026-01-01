import { Activity, Brain, CheckSquare, Target } from "lucide-react-native"
import { ScrollView, View } from "react-native"
import { Text } from "@/components/ui/text"

export default function Dashboard() {
	return (
		<ScrollView className="flex-1 bg-background">
			<View className="gap-6 p-4">
				<View className="gap-2">
					<Text className="font-bold text-2xl">Dashboard</Text>
					<Text className="text-muted-foreground">Welcome to your self-improvement journey</Text>
				</View>

				{/* Quick Stats Grid */}
				<View className="gap-4">
					<StatCard icon={CheckSquare} label="Tasks Today" value="0" color="#3b82f6" />
					<StatCard icon={Target} label="Goals Active" value="0" color="#22c55e" />
					<StatCard icon={Activity} label="Health Score" value="--" color="#ef4444" />
					<StatCard icon={Brain} label="Mood" value="--" color="#a855f7" />
				</View>

				{/* Today's Focus */}
				<View className="rounded-lg border border-border bg-card p-6">
					<Text className="mb-4 font-semibold text-lg">Today's Focus</Text>
					<View className="items-center py-8">
						<Text className="text-center text-muted-foreground text-sm">
							No focus items set for today. Add tasks or goals to see them here.
						</Text>
					</View>
				</View>

				{/* AI Coach Insights */}
				<View className="rounded-lg border border-border bg-card p-6">
					<Text className="mb-4 font-semibold text-lg">AI Coach Insights</Text>
					<View className="gap-4">
						<Text className="text-muted-foreground text-sm">
							"You've been consistent with your morning routine this week. Consider adding a 5-minute journaling session
							to enhance your mindfulness practice."
						</Text>
						<View className="border-border border-t pt-2">
							<Text className="text-muted-foreground text-xs">Powered by your personal data and AI coaching</Text>
						</View>
					</View>
				</View>
			</View>
		</ScrollView>
	)
}

type StatCardProps = {
	icon: typeof CheckSquare
	label: string
	value: string
	color: string
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
	return (
		<View className="rounded-lg border border-border bg-card p-6">
			<View className="flex-row items-center">
				<Icon size={32} color={color} />
				<View className="ml-4">
					<Text className="font-medium text-muted-foreground text-sm">{label}</Text>
					<Text className="font-bold text-2xl">{value}</Text>
				</View>
			</View>
		</View>
	)
}
