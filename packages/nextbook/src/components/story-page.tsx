"use client"

import { Component, type ReactNode } from "react"
import type { StoryTreeNode } from "../types"
import { StoryViewer } from "./story-viewer"

type StoryLoaders = Record<string, () => Promise<Record<string, unknown>>>

type StoryPageProps = {
	path: string[]
	storyTree: StoryTreeNode[]
	loaders: StoryLoaders
}

/**
 * Error boundary to catch story rendering errors.
 */
class StoryErrorBoundary extends Component<
	{ children: ReactNode; onReset?: () => void },
	{ hasError: boolean; error: Error | null }
> {
	constructor(props: { children: ReactNode; onReset?: () => void }) {
		super(props)
		this.state = { hasError: false, error: null }
	}

	static getDerivedStateFromError(error: Error) {
		return { hasError: true, error }
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="rounded border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
					<p className="font-medium">Story crashed</p>
					<p className="mt-1 font-mono text-sm">{this.state.error?.message}</p>
					<button
						type="button"
						onClick={() => {
							this.setState({ hasError: false, error: null })
							this.props.onReset?.()
						}}
						className="mt-3 rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
					>
						Try again
					</button>
				</div>
			)
		}

		return this.props.children
	}
}

/**
 * Count total story files in the tree.
 */
function countStoryFiles(tree: StoryTreeNode[]): number {
	let count = 0
	for (const node of tree) {
		if (node.filePath) count++
		if (node.children) count += countStoryFiles(node.children)
	}
	return count
}

/**
 * Find a node in the tree by path segments.
 */
function findNodeByPath(tree: StoryTreeNode[], path: string[]): StoryTreeNode | null {
	if (path.length === 0) return null

	let currentLevel = tree

	for (let i = 0; i < path.length; i++) {
		const segment = path[i] as string
		const node = currentLevel.find((n) => n.segment.toLowerCase() === segment.toLowerCase())

		if (!node) return null

		if (i === path.length - 1) {
			return node
		}

		if (!node.children) return null
		currentLevel = node.children
	}

	return null
}

/**
 * Find a story file node by trying different path interpretations.
 * The path could be:
 * - ["button"] - just the file name
 * - ["button", "Default"] - file name + export name
 * - ["forms", "input"] - nested directory + file name
 * - ["forms", "input", "Default"] - nested + file + export
 *
 * Returns the node and remaining path segments (export name if any).
 */
function findStoryFile(
	tree: StoryTreeNode[],
	path: string[],
): { node: StoryTreeNode; exportName: string | null } | null {
	// Try progressively shorter paths to find a node with filePath
	for (let i = path.length; i >= 1; i--) {
		const nodePath = path.slice(0, i)
		const node = findNodeByPath(tree, nodePath)

		if (node?.filePath) {
			// Found a story file node
			const remainingPath = path.slice(i)
			const exportName = remainingPath.length > 0 ? (remainingPath[0] as string) : null
			return { node, exportName }
		}
	}

	return null
}

/**
 * Client component for rendering stories.
 * Handles the welcome page, story lookup, and lazy loading.
 */
export function StoryPage({ path, storyTree, loaders }: StoryPageProps) {
	// Welcome page
	if (path.length === 0) {
		const storyCount = countStoryFiles(storyTree)
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

	// Try to find a story file in the path
	const result = findStoryFile(storyTree, path)

	if (!result) {
		// Maybe it's a directory node
		const dirNode = findNodeByPath(storyTree, path)
		if (dirNode && !dirNode.filePath && dirNode.children && dirNode.children.length > 0) {
			return (
				<div className="flex h-full flex-col items-center justify-center p-8 text-center">
					<h1 className="mb-4 font-bold text-neutral-900 text-xl dark:text-neutral-100">{dirNode.name}</h1>
					<p className="text-neutral-600 dark:text-neutral-400">Select a story from the sidebar.</p>
				</div>
			)
		}

		return (
			<div className="flex h-full flex-col items-center justify-center p-8 text-center">
				<h1 className="mb-4 font-bold text-neutral-900 text-xl dark:text-neutral-100">Story not found</h1>
				<p className="text-neutral-600 dark:text-neutral-400">The requested story does not exist.</p>
			</div>
		)
	}

	const { node, exportName } = result

	// Story file without export specified - prompt to select variant
	if (!exportName) {
		return (
			<div className="flex h-full flex-col items-center justify-center p-8 text-center">
				<h1 className="mb-4 font-bold text-neutral-900 text-xl dark:text-neutral-100">{node.name}</h1>
				<p className="text-neutral-600 dark:text-neutral-400">Select a story variant from the sidebar.</p>
			</div>
		)
	}

	// Get loader for this file
	const loader = loaders[node.filePath as string]
	if (!loader) {
		return (
			<div className="flex h-full flex-col items-center justify-center p-8 text-center">
				<h1 className="mb-4 font-bold text-neutral-900 text-xl dark:text-neutral-100">Loader not found</h1>
				<p className="text-neutral-600 dark:text-neutral-400">No loader for: {node.filePath}</p>
			</div>
		)
	}

	const title = path.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(" / ")

	return (
		<StoryErrorBoundary key={path.join("/")}>
			<StoryViewer loader={loader} exportName={exportName} title={title} />
		</StoryErrorBoundary>
	)
}
