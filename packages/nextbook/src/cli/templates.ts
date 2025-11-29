/**
 * File templates for the Nextbook CLI.
 * These are used to scaffold the initial structure.
 */

export const templates = {
	layout: `import "@workspace/ui/globals.css"
import { NextbookShell } from "@workspace/nextbook"
import type { Metadata } from "next"
import { loaders, storyTree } from "./stories"

export const metadata: Metadata = {
	title: "Nextbook | Component Stories",
	description: "Browse and interact with UI components",
}

export default function NextbookLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<NextbookShell tree={storyTree} loaders={loaders}>
					{children}
				</NextbookShell>
			</body>
		</html>
	)
}
`,

	page: `import { StoryPage } from "@workspace/nextbook"
import { loaders, storyTree } from "../stories"

export default async function Page({ params }: { params: Promise<{ path?: string[] }> }) {
	const { path = [] } = await params
	return <StoryPage path={path} storyTree={storyTree} loaders={loaders} />
}
`,

	storiesIndex: `"use client"

import { createStoryRegistry } from "@workspace/nextbook"

export const { storyTree, loaders } = createStoryRegistry({
	example: () => import("./example.story"),
})
`,

	exampleStory: `import { story } from "@workspace/nextbook"
import { z } from "zod"

/**
 * Example story demonstrating Nextbook features.
 * Replace this with your own components!
 */

export const Default = story({
	render: () => (
		<button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
			Click me
		</button>
	),
})

export const WithControls = story({
	schema: z.object({
		label: z.string().default("Click me").describe("Button text"),
		variant: z.enum(["primary", "secondary"]).default("primary").describe("Button style"),
		disabled: z.boolean().default(false).describe("Disabled state"),
	}),
	render: ({ label, variant, disabled }) => (
		<button
			disabled={disabled}
			className={\`rounded-md px-4 py-2 \${
				variant === "primary"
					? "bg-blue-600 text-white hover:bg-blue-700"
					: "bg-gray-200 text-gray-800 hover:bg-gray-300"
			} \${disabled ? "cursor-not-allowed opacity-50" : ""}\`}
		>
			{label}
		</button>
	),
})
`,
}

/**
 * Get the import path for nextbook based on whether it's a workspace or npm package.
 */
export function getNextbookImport(isWorkspace: boolean): string {
	return isWorkspace ? "@workspace/nextbook" : "nextbook"
}

/**
 * Replace @workspace/nextbook with the correct import path in templates.
 */
export function replaceImports(template: string, isWorkspace: boolean): string {
	const importPath = getNextbookImport(isWorkspace)
	return template.replace(/@workspace\/nextbook/g, importPath)
}
