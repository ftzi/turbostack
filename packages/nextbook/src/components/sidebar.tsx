"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { isStory } from "../story"
import type { StoryTreeNode } from "../types"
import { cn } from "../utils/cn"

type StoryLoaders = Record<string, () => Promise<Record<string, unknown>>>

type SidebarProps = {
	tree: StoryTreeNode[]
	loaders: StoryLoaders
	basePath?: string
}

export function Sidebar({ tree, loaders, basePath = "/ui" }: SidebarProps) {
	const [search, setSearch] = useState("")

	// Filter tree based on search
	const filteredTree = useMemo(() => {
		if (!search.trim()) return tree
		return filterTree(tree, search.toLowerCase())
	}, [tree, search])

	return (
		<aside className="flex h-full w-64 flex-col border-neutral-200 border-r bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
			{/* Header */}
			<div className="border-neutral-200 border-b p-4 dark:border-neutral-800">
				<Link
					href={basePath}
					className="font-semibold text-lg text-neutral-900 transition-colors hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-300"
				>
					Nextbook
				</Link>
			</div>

			{/* Search */}
			<div className="border-neutral-200 border-b p-2 dark:border-neutral-800">
				<input
					type="text"
					placeholder="Search stories..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full rounded border border-neutral-200 bg-white px-3 py-1.5 text-neutral-900 text-sm placeholder-neutral-400 focus:border-neutral-400 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-neutral-500"
				/>
			</div>

			{/* Tree */}
			<nav className="flex-1 overflow-y-auto p-2">
				{filteredTree.length > 0 ? (
					<TreeNodes nodes={filteredTree} loaders={loaders} basePath={basePath} depth={0} />
				) : (
					<p className="px-2 py-4 text-center text-neutral-500 text-sm">No stories found</p>
				)}
			</nav>
		</aside>
	)
}

/**
 * Filter tree nodes based on search query.
 */
function filterTree(nodes: StoryTreeNode[], query: string): StoryTreeNode[] {
	const result: StoryTreeNode[] = []

	for (const node of nodes) {
		const nameMatches = node.name.toLowerCase().includes(query)

		if (node.children && node.children.length > 0) {
			const filteredChildren = filterTree(node.children, query)
			if (filteredChildren.length > 0 || nameMatches) {
				result.push({
					...node,
					children: filteredChildren.length > 0 ? filteredChildren : node.children,
				})
			}
		} else if (nameMatches) {
			result.push(node)
		}
	}

	return result
}

type TreeNodesProps = {
	nodes: StoryTreeNode[]
	loaders: StoryLoaders
	basePath: string
	depth: number
	parentPath?: string[]
}

function TreeNodes({ nodes, loaders, basePath, depth, parentPath = [] }: TreeNodesProps) {
	return (
		<ul className="space-y-0.5">
			{nodes.map((node) => (
				<TreeNode
					key={node.segment}
					node={node}
					loaders={loaders}
					basePath={basePath}
					depth={depth}
					parentPath={parentPath}
				/>
			))}
		</ul>
	)
}

type TreeNodeProps = {
	node: StoryTreeNode
	loaders: StoryLoaders
	basePath: string
	depth: number
	parentPath: string[]
}

function TreeNode({ node, loaders, basePath, depth, parentPath }: TreeNodeProps) {
	const pathname = usePathname()
	const [isOpen, setIsOpen] = useState(true)
	const currentPath = [...parentPath, node.segment]
	const paddingLeft = depth * 12 + 8
	const pathPrefix = `${basePath}/${currentPath.join("/").toLowerCase()}`
	const isAncestorOfActive = pathname.toLowerCase().startsWith(pathPrefix)

	// Story file node
	if (node.filePath) {
		return (
			<StoryFileNode
				node={node}
				loaders={loaders}
				basePath={basePath}
				currentPath={currentPath}
				paddingLeft={paddingLeft}
				isAncestorOfActive={isAncestorOfActive}
				isOpen={isOpen}
				onToggle={() => setIsOpen(!isOpen)}
			/>
		)
	}

	// Directory node
	if (node.children && node.children.length > 0) {
		return (
			<DirectoryNode
				node={node}
				loaders={loaders}
				basePath={basePath}
				depth={depth}
				currentPath={currentPath}
				paddingLeft={paddingLeft}
				isAncestorOfActive={isAncestorOfActive}
				isOpen={isOpen}
				onToggle={() => setIsOpen(!isOpen)}
			/>
		)
	}

	return null
}

// Expand button shared by story files and directories
function ExpandButton({
	isOpen,
	isActive,
	onClick,
	name,
	paddingLeft,
}: {
	isOpen: boolean
	isActive: boolean
	onClick: () => void
	name: string
	paddingLeft: number
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"flex w-full items-center gap-1 rounded px-2 py-1.5 text-sm transition-colors",
				isActive
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
			{name}
		</button>
	)
}

// Story file node - loads exports lazily
function StoryFileNode({
	node,
	loaders,
	basePath,
	currentPath,
	paddingLeft,
	isAncestorOfActive,
	isOpen,
	onToggle,
}: {
	node: StoryTreeNode
	loaders: StoryLoaders
	basePath: string
	currentPath: string[]
	paddingLeft: number
	isAncestorOfActive: boolean
	isOpen: boolean
	onToggle: () => void
}) {
	const pathname = usePathname()
	const [exports, setExports] = useState<string[]>([])
	const [loading, setLoading] = useState(false)

	// Load exports when expanded
	useEffect(() => {
		if (isOpen && exports.length === 0 && node.filePath) {
			const loader = loaders[node.filePath]
			if (loader) {
				setLoading(true)
				loader()
					.then((mod) => {
						const storyExports = Object.entries(mod)
							.filter(([, value]) => isStory(value))
							.map(([name]) => name)
						setExports(storyExports)
					})
					.catch((err) => {
						console.error("[nextbook] Failed to load exports:", err)
					})
					.finally(() => {
						setLoading(false)
					})
			}
		}
	}, [isOpen, exports.length, node.filePath, loaders])

	return (
		<li>
			<ExpandButton
				isOpen={isOpen}
				isActive={isAncestorOfActive}
				onClick={onToggle}
				name={node.name}
				paddingLeft={paddingLeft}
			/>
			{isOpen && (
				<ExportsList
					exports={exports}
					loading={loading}
					basePath={basePath}
					currentPath={currentPath}
					paddingLeft={paddingLeft + 20}
					pathname={pathname}
				/>
			)}
		</li>
	)
}

// Exports list for a story file
function ExportsList({
	exports,
	loading,
	basePath,
	currentPath,
	paddingLeft,
	pathname,
}: {
	exports: string[]
	loading: boolean
	basePath: string
	currentPath: string[]
	paddingLeft: number
	pathname: string
}) {
	if (loading) {
		return (
			<ul className="space-y-0.5">
				<li className="px-2 py-1.5 text-neutral-400 text-sm dark:text-neutral-500" style={{ paddingLeft }}>
					Loading...
				</li>
			</ul>
		)
	}

	if (exports.length === 0) {
		return (
			<ul className="space-y-0.5">
				<li className="px-2 py-1.5 text-neutral-400 text-sm dark:text-neutral-500" style={{ paddingLeft }}>
					No stories
				</li>
			</ul>
		)
	}

	return (
		<ul className="space-y-0.5">
			{exports.map((exportName) => {
				const url = `${basePath}/${currentPath.join("/")}/${exportName}`.toLowerCase()
				const isActive = pathname.toLowerCase() === url
				return (
					<li key={exportName}>
						<Link
							href={url}
							className={cn(
								"block rounded px-2 py-1.5 text-sm transition-colors",
								isActive
									? "bg-neutral-200 font-medium text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100"
									: "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
							)}
							style={{ paddingLeft }}
						>
							{exportName}
						</Link>
					</li>
				)
			})}
		</ul>
	)
}

// Directory node
function DirectoryNode({
	node,
	loaders,
	basePath,
	depth,
	currentPath,
	paddingLeft,
	isAncestorOfActive,
	isOpen,
	onToggle,
}: {
	node: StoryTreeNode
	loaders: StoryLoaders
	basePath: string
	depth: number
	currentPath: string[]
	paddingLeft: number
	isAncestorOfActive: boolean
	isOpen: boolean
	onToggle: () => void
}) {
	return (
		<li>
			<ExpandButton
				isOpen={isOpen}
				isActive={isAncestorOfActive}
				onClick={onToggle}
				name={node.name}
				paddingLeft={paddingLeft}
			/>
			{isOpen && node.children && (
				<TreeNodes
					nodes={node.children}
					loaders={loaders}
					basePath={basePath}
					depth={depth + 1}
					parentPath={currentPath}
				/>
			)}
		</li>
	)
}
