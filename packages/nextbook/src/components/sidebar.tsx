"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import type { StoryTreeNode } from "../types"
import { cn } from "../utils/cn"
import { segmentsToUrl } from "../utils/path"

type SidebarProps = {
	tree: StoryTreeNode[]
	basePath?: string
}

export function Sidebar({ tree, basePath = "/ui" }: SidebarProps) {
	return (
		<aside className="h-full w-64 overflow-y-auto border-neutral-200 border-r bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
			<div className="border-neutral-200 border-b p-4 dark:border-neutral-800">
				<Link
					href={basePath}
					className="font-semibold text-lg text-neutral-900 transition-colors hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-300"
				>
					Nextbook
				</Link>
			</div>
			<nav className="p-2">
				<TreeNodes nodes={tree} basePath={basePath} depth={0} />
			</nav>
		</aside>
	)
}

type TreeNodesProps = {
	nodes: StoryTreeNode[]
	basePath: string
	depth: number
	parentPath?: string[]
}

function TreeNodes({ nodes, basePath, depth, parentPath = [] }: TreeNodesProps) {
	return (
		<ul className="space-y-0.5">
			{nodes.map((node) => (
				<TreeNode key={node.segment} node={node} basePath={basePath} depth={depth} parentPath={parentPath} />
			))}
		</ul>
	)
}

type TreeNodeProps = {
	node: StoryTreeNode
	basePath: string
	depth: number
	parentPath: string[]
}

function TreeNode({ node, basePath, depth, parentPath }: TreeNodeProps) {
	const pathname = usePathname()
	const [isOpen, setIsOpen] = useState(true)
	const currentPath = [...parentPath, node.segment]

	// Check if this is a leaf node (story) or branch (directory)
	const isLeaf = !node.children || node.children.length === 0
	const hasChildren = node.children && node.children.length > 0

	// Build the URL for this node
	const url = isLeaf && node.story ? segmentsToUrl(node.story.path, basePath) : undefined

	// Check if this node or any child is active
	const isActive = url ? pathname === url : false
	const isAncestorOfActive = !isLeaf && pathname.startsWith(`${basePath}/${currentPath.join("/")}`)

	const paddingLeft = depth * 12 + 8

	if (isLeaf) {
		return (
			<li>
				<Link
					href={url || basePath}
					className={cn(
						"block rounded px-2 py-1.5 text-sm transition-colors",
						isActive
							? "bg-neutral-200 font-medium text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100"
							: "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
					)}
					style={{ paddingLeft }}
				>
					{node.name}
				</Link>
			</li>
		)
	}

	return (
		<li>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					"flex w-full items-center gap-1 rounded px-2 py-1.5 text-sm transition-colors",
					isAncestorOfActive
						? "font-medium text-neutral-900 dark:text-neutral-100"
						: "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
				)}
				style={{ paddingLeft }}
			>
				<span
					className={cn(
						"flex h-4 w-4 items-center justify-center text-[10px] transition-transform",
						isOpen ? "rotate-90" : "",
					)}
				>
					▶
				</span>
				{node.name}
			</button>
			{hasChildren && isOpen && node.children && (
				<TreeNodes nodes={node.children} basePath={basePath} depth={depth + 1} parentPath={currentPath} />
			)}
		</li>
	)
}
