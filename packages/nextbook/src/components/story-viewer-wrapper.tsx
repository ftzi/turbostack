"use client"

import { StoryViewer } from "./story-viewer"

type StoryLoaders = Record<string, () => Promise<Record<string, unknown>>>

type StoryViewerWrapperProps = {
	loaders: StoryLoaders
	filePath: string
	exportName: string
	title: string
}

/**
 * Client wrapper that holds loaders and renders StoryViewer.
 * This allows loaders (functions) to stay on the client side.
 */
export function StoryViewerWrapper({ loaders, filePath, exportName, title }: StoryViewerWrapperProps) {
	const loader = loaders[filePath]

	if (!loader) {
		return (
			<div className="flex h-full flex-col items-center justify-center p-8 text-center">
				<h1 className="mb-4 font-bold text-neutral-900 text-xl dark:text-neutral-100">Loader not found</h1>
				<p className="text-neutral-600 dark:text-neutral-400">No loader for: {filePath}</p>
			</div>
		)
	}

	return <StoryViewer loader={loader} exportName={exportName} title={title} />
}
