import type * as React from "react"

type DashboardPageProps = {
	title: string
	subtitle: string
	action?: React.ReactNode
	maxWidth?: "4xl" | "6xl"
	children: React.ReactNode
}

export function DashboardPage({ title, subtitle, action, maxWidth = "6xl", children }: DashboardPageProps) {
	const maxWidthClass = maxWidth === "4xl" ? "max-w-4xl" : "max-w-6xl"

	return (
		<div className="p-8">
			<div className={`${maxWidthClass} mx-auto`}>
				{/* Header */}
				{action ? (
					<div className="mb-8 flex items-center justify-between">
						<div>
							<h1 className="font-bold text-3xl text-gray-900 dark:text-white">{title}</h1>
							<p className="mt-1 text-gray-600 dark:text-gray-400">{subtitle}</p>
						</div>
						{action}
					</div>
				) : (
					<div className="mb-8">
						<h1 className="font-bold text-3xl text-gray-900 dark:text-white">{title}</h1>
						<p className="mt-1 text-gray-600 dark:text-gray-400">{subtitle}</p>
					</div>
				)}

				{/* Content */}
				{children}
			</div>
		</div>
	)
}
