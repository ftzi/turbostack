import type { ReactNode } from "react"
import type { StoryTreeNode } from "../types"
import { Sidebar } from "./sidebar"

type NextbookShellProps = {
	children: ReactNode
	tree: StoryTreeNode[]
	basePath?: string
	/** Wrap content with html and body tags. Defaults to true. */
	withHtmlBody?: boolean
}

/**
 * Shell component that provides the Nextbook layout.
 * Includes the sidebar navigation and main content area.
 *
 * By default, wraps content with html/body tags for isolation from your main app.
 * Set `withHtmlBody={false}` if you want to provide your own html/body tags.
 *
 * @example
 * // app/ui/layout.tsx - Simple usage (recommended)
 * import { NextbookShell } from '@workspace/nextbook'
 *
 * export default function Layout({ children }) {
 *   return <NextbookShell tree={storyTree}>{children}</NextbookShell>
 * }
 *
 * @example
 * // Custom html/body tags
 * export default function Layout({ children }) {
 *   return (
 *     <html lang="fr">
 *       <body className="custom">
 *         <NextbookShell tree={storyTree} withHtmlBody={false}>
 *           {children}
 *         </NextbookShell>
 *       </body>
 *     </html>
 *   )
 * }
 */
export function NextbookShell({ children, tree, basePath = "/ui", withHtmlBody = true }: NextbookShellProps) {
	const content = (
		<div className="flex h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
			<Sidebar tree={tree} basePath={basePath} />
			<main className="flex-1 overflow-hidden">{children}</main>
		</div>
	)

	if (withHtmlBody) {
		return (
			<html lang="en" suppressHydrationWarning>
				<body>{content}</body>
			</html>
		)
	}

	return content
}
