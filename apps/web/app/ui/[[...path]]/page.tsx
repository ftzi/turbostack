import { StoryPage, storyTree } from "../stories"

export default async function Page({ params }: { params: Promise<{ path?: string[] }> }) {
	const { path = [] } = await params

	// Index page - show welcome message
	if (path.length === 0) {
		return (
			<div className="flex h-full flex-col items-center justify-center p-8 text-center">
				<h1 className="mb-4 font-bold text-3xl text-neutral-900 dark:text-neutral-100">Welcome to Nextbook</h1>
				<p className="mb-2 text-neutral-600 dark:text-neutral-400">Select a story from the sidebar to get started.</p>
				<p className="text-neutral-500 text-sm dark:text-neutral-500">
					{countStories(storyTree)} {countStories(storyTree) === 1 ? "story" : "stories"} available
				</p>
			</div>
		)
	}

	return <StoryPage path={path} />
}

function countStories(tree: typeof storyTree): number {
	let count = 0
	for (const node of tree) {
		if (node.story) count++
		if (node.children) count += countStories(node.children)
	}
	return count
}
