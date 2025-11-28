"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getErrorMessage } from "@workspace/shared/utils/error"
import { Button } from "@workspace/ui/components/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@workspace/ui/components/tooltip"
import { RefreshCw } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { orpc } from "@/lib/query"

function UserTableSkeleton(): React.ReactElement {
	return (
		<>
			{Array.from({ length: 5 }).map((_, i) => (
				<tr key={`skeleton-${i.toString()}`} className="border-b">
					<td className="px-4 py-3">
						<Skeleton className="h-5 w-32" />
					</td>
					<td className="px-4 py-3">
						<Skeleton className="h-5 w-48" />
					</td>
					<td className="px-4 py-3">
						<Skeleton className="h-9 w-24" />
					</td>
					<td className="px-4 py-3">
						<Skeleton className="h-5 w-24" />
					</td>
				</tr>
			))}
		</>
	)
}

function EmptyState(): React.ReactElement {
	return (
		<tr>
			<td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
				No users found
			</td>
		</tr>
	)
}

export default function AdminUsersPage(): React.ReactElement {
	const queryClient = useQueryClient()
	const { data: session } = authClient.useSession()
	const currentUserId = session?.user?.id

	const { data: users, isLoading, refetch, isRefetching } = useQuery(orpc.admin.listUsers.queryOptions({ input: {} }))

	const updateRoleMutation = useMutation({
		...orpc.admin.updateUserRole.mutationOptions(),
		onSuccess: (updatedUser) => {
			toast.success(`Role updated to "${updatedUser.role}" for ${updatedUser.name}`)
			queryClient.invalidateQueries({ queryKey: orpc.admin.listUsers.queryOptions({ input: {} }).queryKey })
		},
		onError: (error) => {
			toast.error(getErrorMessage(error, "Failed to update role"))
		},
	})

	const handleRoleChange = (userId: string, role: "user" | "admin") => {
		updateRoleMutation.mutate({ userId, role })
	}

	const renderTableBody = () => {
		if (isLoading) {
			return <UserTableSkeleton />
		}

		if (!users || users.length === 0) {
			return <EmptyState />
		}

		return users.map((user) => {
			const isCurrentUser = user.id === currentUserId
			return (
				<tr key={user.id} className="border-b last:border-b-0">
					<td className="px-4 py-3">
						<div className="flex items-center gap-3">
							{user.image ? (
								<Image
									src={user.image}
									alt={user.name}
									width={32}
									height={32}
									className="size-8 rounded-full object-cover"
								/>
							) : (
								<div className="flex size-8 items-center justify-center rounded-full bg-muted font-medium text-sm">
									{user.name.charAt(0).toUpperCase()}
								</div>
							)}
							<span className="font-medium">{user.name}</span>
						</div>
					</td>
					<td className="px-4 py-3 text-muted-foreground">{user.email}</td>
					<td className="px-4 py-3">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<div>
										<Select
											value={user.role}
											onValueChange={(value: "user" | "admin") => handleRoleChange(user.id, value)}
											disabled={isCurrentUser || updateRoleMutation.isPending}
										>
											<SelectTrigger className="w-24">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="user">user</SelectItem>
												<SelectItem value="admin">admin</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</TooltipTrigger>
								{isCurrentUser && (
									<TooltipContent>
										<p>You cannot change your own role</p>
									</TooltipContent>
								)}
							</Tooltip>
						</TooltipProvider>
					</td>
					<td className="px-4 py-3 text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
				</tr>
			)
		})
	}

	return (
		<div className="p-6 lg:p-8">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl tracking-tight">Users</h1>
					<p className="text-muted-foreground">Manage user accounts and roles</p>
				</div>
				<Button variant="outline" size="sm" onClick={() => refetch()} disabled={isRefetching}>
					<RefreshCw className={`mr-2 size-4 ${isRefetching ? "animate-spin" : ""}`} />
					Refresh
				</Button>
			</div>

			<div className="rounded-lg border">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b bg-muted/50">
								<th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">Name</th>
								<th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">Email</th>
								<th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">Role</th>
								<th className="px-4 py-3 text-left font-medium text-muted-foreground text-sm">Created</th>
							</tr>
						</thead>
						<tbody>{renderTableBody()}</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
