"use client"

import { getErrorMessage } from "@workspace/shared/utils/error"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Separator } from "@workspace/ui/components/separator"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"

export default function AuthPage() {
	const router = useRouter()
	const [isSignUp, setIsSignUp] = useState(false)
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [name, setName] = useState("")
	const [isLoading, setIsLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)

		try {
			if (isSignUp) {
				await authClient.signUp.email({
					email,
					password,
					name,
				})
			} else {
				await authClient.signIn.email({
					email,
					password,
				})
			}

			router.push("/dashboard")
		} catch (error) {
			const message = getErrorMessage(error, isSignUp ? "Sign up failed" : "Sign in failed")
			toast.error(message)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h1 className="font-bold text-3xl">{isSignUp ? "Create your account" : "Welcome back"}</h1>
					<p className="mt-2 text-gray-600 text-sm dark:text-gray-400">
						{isSignUp ? "Sign up to start your journey" : "Sign in to continue to your dashboard"}
					</p>
				</div>

				<div className="rounded-lg border bg-white p-8 shadow-sm dark:bg-gray-900">
					<form onSubmit={handleSubmit} className="space-y-6">
						{isSignUp && (
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required={isSignUp}
									placeholder="Your name"
									disabled={isLoading}
								/>
							</div>
						)}

						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								placeholder="you@example.com"
								disabled={isLoading}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								placeholder="••••••••"
								minLength={8}
								disabled={isLoading}
							/>
						</div>

						<Button type="submit" className="w-full" isLoading={isLoading}>
							{isSignUp ? "Sign up" : "Sign in"}
						</Button>
					</form>

					<div className="mt-6">
						<Separator />
						<div className="mt-6 text-center text-sm">
							<button
								type="button"
								onClick={() => {
									setIsSignUp(!isSignUp)
									setName("")
								}}
								className="text-primary hover:underline"
								disabled={isLoading}
							>
								{isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
