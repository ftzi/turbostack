import type { StoryMeta, StoryTreeNode } from "../types"

// Regex patterns (moved to top level for performance)
const STORY_EXT_REGEX = /\.story\.tsx?$/

/**
 * Capitalize the first character of a string.
 *
 * @example
 * capitalizeFirst('button') // => 'Button'
 * capitalizeFirst('text-input') // => 'Text-input'
 */
export function capitalizeFirst(str: string): string {
	if (!str) return str
	return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convert a file path to display segments.
 * Removes .story.tsx extension and capitalizes first char of each segment.
 *
 * @example
 * pathToSegments('Forms/Input.story.tsx') // => ['Forms', 'Input']
 * pathToSegments('button.story.tsx') // => ['Button']
 */
export function pathToSegments(filePath: string): string[] {
	// Remove .story.tsx extension
	const withoutExt = filePath.replace(STORY_EXT_REGEX, "")

	// Split by path separator
	const segments = withoutExt.split("/").filter(Boolean)

	// Capitalize first char of each segment
	return segments.map(capitalizeFirst)
}

/**
 * Build a full story path from file path and export name.
 *
 * @example
 * buildStoryPath('Forms/Input.story.tsx', 'Primary')
 * // => ['Forms', 'Input', 'Primary']
 */
export function buildStoryPath(filePath: string, exportName: string): string[] {
	const segments = pathToSegments(filePath)
	return [...segments, capitalizeFirst(exportName)]
}

/**
 * Convert path segments to a URL path.
 *
 * @example
 * segmentsToUrl(['Forms', 'Input', 'Primary']) // => '/ui/Forms/Input/Primary'
 */
export function segmentsToUrl(segments: string[], basePath = "/ui"): string {
	return `${basePath}/${segments.join("/")}`
}

/**
 * Parse URL path segments back to story path.
 *
 * @example
 * parseUrlPath(['Forms', 'Input', 'Primary'])
 * // => { filePath: 'Forms/Input', exportName: 'Primary' }
 */
export function parseUrlPath(segments: string[]): { filePath: string; exportName: string } | null {
	if (segments.length < 1) return null

	// Last segment is the export name, rest is file path
	const exportName = segments[segments.length - 1] as string
	const filePath = segments.slice(0, -1).join("/")

	return { filePath: filePath || exportName, exportName }
}

/**
 * Build a tree structure from a list of story metadata.
 * Used for sidebar navigation.
 */
export function buildStoryTree(stories: StoryMeta[]): StoryTreeNode[] {
	const root: StoryTreeNode[] = []

	for (const story of stories) {
		let currentLevel = root
		const pathWithoutExport = story.path.slice(0, -1) // All except export name

		// Navigate/create tree structure for directory path
		for (const segment of pathWithoutExport) {
			let node = currentLevel.find((n) => n.segment === segment)

			if (!node) {
				node = {
					name: segment,
					segment,
					children: [],
				}
				currentLevel.push(node)
			}

			if (node.children) {
				currentLevel = node.children
			}
		}

		// Add the story variant as a leaf node
		const exportName = story.path[story.path.length - 1] as string
		currentLevel.push({
			name: exportName,
			segment: exportName,
			story,
		})
	}

	// Sort tree alphabetically
	sortTree(root)

	return root
}

/**
 * Recursively sort tree nodes alphabetically.
 */
function sortTree(nodes: StoryTreeNode[]): void {
	nodes.sort((a, b) => a.name.localeCompare(b.name))

	for (const node of nodes) {
		if (node.children) {
			sortTree(node.children)
		}
	}
}

/**
 * Find a story in the tree by path segments.
 */
export function findStoryInTree(tree: StoryTreeNode[], segments: string[]): StoryMeta | null {
	if (segments.length === 0) return null

	let currentLevel = tree

	for (let i = 0; i < segments.length; i++) {
		const segment = segments[i] as string
		const node = currentLevel.find((n) => n.segment.toLowerCase() === segment.toLowerCase())

		if (!node) return null

		// If this is the last segment, return the story
		if (i === segments.length - 1) {
			return node.story || null
		}

		// Otherwise, navigate deeper
		if (!node.children) return null
		currentLevel = node.children
	}

	return null
}
