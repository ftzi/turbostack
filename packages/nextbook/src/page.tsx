import { notFound } from "next/navigation"
import type { StoryMeta, StoryTreeNode } from "./types"

type StoryLoaders = Record<string, () => Promise<Record<string, unknown>>>

type NextbookPageProps = {
	params: Promise<{ path?: string[] }>
	storyTree: StoryTreeNode[]
	loaders: StoryLoaders
}

// Client component for rendering the story
import { StoryViewerWrapper } from "./components/story-viewer-wrapper"

/**
 * Page component for rendering Nextbook stories.
 * This is a server component that loads and renders the appropriate story.
 */
export async function NextbookPage({ params, storyTree, loaders }: NextbookPageProps) {
	const { path = [] } = await params

	// Index page
	if (path.length === 0) {
		return <IndexPage storyCount={countStories(storyTree)} />
	}

	// Find the story in the tree
	const storyMeta = findStoryByPath(storyTree, path)

	if (!storyMeta) {
		notFound()
	}

	// Build display title
	const title = storyMeta.path.join(" / ")

	return (
		<StoryViewerWrapper
			loaders={loaders}
			filePath={storyMeta.filePath}
			exportName={storyMeta.exportName}
			title={title}
		/>
	)
}

/**
 * Find a story in the tree by URL path segments.
 */
function findStoryByPath(tree: StoryTreeNode[], path: string[]): StoryMeta | null {
	let currentLevel = tree

	for (let i = 0; i < path.length; i++) {
		const segment = path[i] as string
		const node = currentLevel.find((n) => n.segment.toLowerCase() === segment.toLowerCase())

		if (!node) return null

		// If this is the last segment, return the story
		if (i === path.length - 1) {
			return node.story || null
		}

		// Otherwise, navigate deeper
		if (!node.children) return null
		currentLevel = node.children
	}

	return null
}

/**
 * Count total stories in the tree.
 */
function countStories(tree: StoryTreeNode[]): number {
	let count = 0

	for (const node of tree) {
		if (node.story) {
			count++
		}
		if (node.children) {
			count += countStories(node.children)
		}
	}

	return count
}

/**
 * Index page shown when no story is selected.
 */
function IndexPage({ storyCount }: { storyCount: number }) {
	return (
		<div className="flex h-full flex-col items-center justify-center p-8 text-center">
			<h1 className="mb-4 font-bold text-3xl text-neutral-900 dark:text-neutral-100">Welcome to Nextbook</h1>
			<p className="mb-2 text-neutral-600 dark:text-neutral-400">Select a story from the sidebar to get started.</p>
			<p className="text-neutral-500 text-sm dark:text-neutral-500">
				{storyCount} {storyCount === 1 ? "story" : "stories"} available
			</p>
		</div>
	)
}

/**
 * Helper to create a page component with pre-configured tree and loaders.
 */
export function createNextbookPage(config: { storyTree: StoryTreeNode[]; loaders: StoryLoaders }) {
	return async function Page({ params }: { params: Promise<{ path?: string[] }> }) {
		return await NextbookPage({
			params,
			storyTree: config.storyTree,
			loaders: config.loaders,
		})
	}
}
