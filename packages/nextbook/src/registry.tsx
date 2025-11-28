"use client"

import type { ReactNode } from "react"
import { StoryViewer } from "./components/story-viewer"
import { isStory } from "./story"
import type { StoryMeta, StoryTreeNode } from "./types"
import { buildStoryTree } from "./utils/path"

type StoryModule = Record<string, unknown>
type StoryLoader = () => Promise<StoryModule>
type StoryLoaders = Record<string, StoryLoader>

type StoryRegistry = {
	storyTree: StoryTreeNode[]
	StoryPage: (props: { path: string[] }) => ReactNode
}

// Regex for removing .story extension
const STORY_EXT_REGEX = /\.story$/

/**
 * Create a story registry from lazy loaders.
 *
 * @example
 * export const { storyTree, StoryPage } = await createStoryRegistry({
 *   "button.story": () => import("./button.story"),
 *   "forms/input.story": () => import("./forms/input.story"),
 * })
 */
export async function createStoryRegistry(loaders: StoryLoaders): Promise<StoryRegistry> {
	// Load all modules in parallel to discover exports
	const entries = Object.entries(loaders)
	const modules = await Promise.all(
		entries.map(async ([path, loader]) => {
			const mod = await loader()
			return { path, mod }
		}),
	)

	// Build metadata from loaded modules
	const stories: StoryMeta[] = []

	for (const { path, mod } of modules) {
		for (const [exportName, value] of Object.entries(mod)) {
			if (isStory(value)) {
				const pathWithoutExt = path.replace(STORY_EXT_REGEX, "")
				const segments = pathWithoutExt.split("/")
				const capitalizedSegments = segments.map((s) => s.charAt(0).toUpperCase() + s.slice(1))

				stories.push({
					path: [...capitalizedSegments, exportName],
					name: exportName,
					filePath: path,
					exportName,
				})
			}
		}
	}

	const storyTree = buildStoryTree(stories)

	// Find story metadata by URL path
	function findStoryByPath(tree: StoryTreeNode[], urlPath: string[]): StoryMeta | null {
		let currentLevel = tree

		for (let i = 0; i < urlPath.length; i++) {
			const segment = urlPath[i] as string
			const node = currentLevel.find((n) => n.segment.toLowerCase() === segment.toLowerCase())

			if (!node) return null

			if (i === urlPath.length - 1) {
				return node.story || null
			}

			if (!node.children) return null
			currentLevel = node.children
		}

		return null
	}

	// Client component for rendering a story
	function StoryPage({ path }: { path: string[] }): ReactNode {
		const storyMeta = findStoryByPath(storyTree, path)

		if (!storyMeta) {
			return (
				<div className="flex h-full flex-col items-center justify-center p-8 text-center">
					<h1 className="mb-4 font-bold text-neutral-900 text-xl dark:text-neutral-100">Story not found</h1>
					<p className="text-neutral-600 dark:text-neutral-400">The requested story does not exist.</p>
				</div>
			)
		}

		const loader = loaders[storyMeta.filePath]
		if (!loader) {
			return (
				<div className="flex h-full flex-col items-center justify-center p-8 text-center">
					<h1 className="mb-4 font-bold text-neutral-900 text-xl dark:text-neutral-100">Loader not found</h1>
					<p className="text-neutral-600 dark:text-neutral-400">No loader for: {storyMeta.filePath}</p>
				</div>
			)
		}

		const title = storyMeta.path.join(" / ")

		return <StoryViewer loader={loader} exportName={storyMeta.exportName} title={title} />
	}

	return { storyTree, StoryPage }
}
