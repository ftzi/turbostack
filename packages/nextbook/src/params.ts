import { findStoryFiles, getDefaultStoriesDir, getStoryExports } from "./utils/discovery"
import { buildStoryPath } from "./utils/path"

// Regex patterns (moved to top level for performance)
const STORY_EXT_REGEX = /\.story\.tsx$/

type NextbookParams = {
	path: string[]
}

/**
 * Generate static params for Next.js generateStaticParams.
 * Discovers all story files and their exports to create URL paths.
 *
 * @example
 * // app/ui/[...path]/page.tsx
 * export { generateNextbookParams as generateStaticParams } from '@workspace/nextbook'
 *
 * @param storiesDir - Optional custom stories directory (defaults to app/ui/stories)
 * @returns Array of path params for static generation
 */
export async function generateNextbookParams(storiesDir?: string): Promise<NextbookParams[]> {
	const dir = storiesDir || getDefaultStoriesDir()
	const files = findStoryFiles(dir)

	// Load all story modules in parallel
	const modulePromises = files.map(async (file) => {
		try {
			// Build the import path relative to the stories directory
			// Remove .story.tsx extension for the import
			const importPath = file.replace(STORY_EXT_REGEX, ".story")

			// Dynamic import to get exports
			// Note: This runs at build time via generateStaticParams
			const mod = await import(`@/app/ui/stories/${importPath}`)
			return { file, mod, error: null }
		} catch (error) {
			console.warn(`[nextbook] Could not load story: ${file}`, error)
			return { file, mod: null, error }
		}
	})

	const results = await Promise.all(modulePromises)

	// Build params from loaded modules
	const params: NextbookParams[] = []
	for (const { file, mod } of results) {
		if (mod) {
			const exports = getStoryExports(mod)
			for (const exportName of exports) {
				const path = buildStoryPath(file, exportName)
				params.push({ path })
			}
		}
	}

	// Add index route
	params.push({ path: [] })

	return params
}

/**
 * Create a generateStaticParams function with custom configuration.
 *
 * @example
 * // app/ui/[...path]/page.tsx
 * export const generateStaticParams = createGenerateParams({
 *   storiesDir: 'app/ui/stories',
 * })
 */
export function createGenerateParams(options?: { storiesDir?: string }) {
	return () => generateNextbookParams(options?.storiesDir)
}
