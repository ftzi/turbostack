import { readdirSync } from "node:fs"
import { join, relative } from "node:path"
import type { StoryMeta } from "../types"
import { buildStoryPath } from "./path"

/**
 * Recursively find all .story.tsx files in a directory.
 *
 * @param dir - Directory to search
 * @param baseDir - Base directory for relative paths (defaults to dir)
 * @returns Array of relative file paths
 */
export function findStoryFiles(dir: string, baseDir?: string): string[] {
	const base = baseDir || dir
	const files: string[] = []

	try {
		const entries = readdirSync(dir, { withFileTypes: true })

		for (const entry of entries) {
			const fullPath = join(dir, entry.name)

			if (entry.isDirectory()) {
				// Recurse into subdirectories
				files.push(...findStoryFiles(fullPath, base))
			} else if (entry.name.endsWith(".story.tsx")) {
				// Add story file with relative path
				const relativePath = relative(base, fullPath)
				files.push(relativePath)
			}
		}
	} catch {
		// Directory doesn't exist or can't be read
		console.warn(`[nextbook] Could not read directory: ${dir}`)
	}

	return files
}

/**
 * Get all named exports from a story file.
 * Filters out internal exports (starting with _) and default.
 *
 * @param mod - The imported module
 * @returns Array of export names
 */
export function getStoryExports(mod: Record<string, unknown>): string[] {
	return Object.keys(mod).filter((key) => {
		// Skip default export
		if (key === "default") return false
		// Skip private exports
		if (key.startsWith("_")) return false
		// Only include story objects
		const value = mod[key]
		return typeof value === "object" && value !== null && "__nextbook" in value && value.__nextbook === true
	})
}

/**
 * Discover all stories in a directory.
 * Returns metadata for each story variant.
 *
 * @param storiesDir - Directory containing story files
 * @param importFn - Function to dynamically import a story file
 * @returns Array of story metadata
 */
export async function discoverStories(
	storiesDir: string,
	importFn: (path: string) => Promise<Record<string, unknown>>,
): Promise<StoryMeta[]> {
	const files = findStoryFiles(storiesDir)

	// Load all modules in parallel
	const modulePromises = files.map(async (file) => {
		try {
			const mod = await importFn(file)
			return { file, mod, error: null }
		} catch (error) {
			console.warn(`[nextbook] Could not load story file: ${file}`, error)
			return { file, mod: null, error }
		}
	})

	const results = await Promise.all(modulePromises)

	// Build stories from loaded modules
	const stories: StoryMeta[] = []
	for (const { file, mod } of results) {
		if (mod) {
			const exports = getStoryExports(mod)
			for (const exportName of exports) {
				const path = buildStoryPath(file, exportName)
				stories.push({
					path,
					name: path[path.length - 1] as string,
					filePath: file,
					exportName,
				})
			}
		}
	}

	return stories
}

/**
 * Get the default stories directory path.
 * Assumes the standard location: app/ui/stories/
 */
export function getDefaultStoriesDir(): string {
	return join(process.cwd(), "app/ui/stories")
}
