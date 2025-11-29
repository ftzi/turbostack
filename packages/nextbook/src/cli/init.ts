import { existsSync, mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { replaceImports, templates } from "./templates"

type InitOptions = {
	/** Base directory (defaults to cwd) */
	cwd?: string
	/** Path to app directory relative to cwd (defaults to "app") */
	appDir?: string
	/** Path for nextbook UI relative to app dir (defaults to "ui") */
	uiPath?: string
	/** Use workspace imports instead of npm package */
	workspace?: boolean
	/** Skip if files already exist */
	skipExisting?: boolean
}

type InitResult = {
	success: boolean
	created: string[]
	skipped: string[]
	errors: string[]
}

/**
 * Initialize the Nextbook file structure.
 */
export function init(options: InitOptions = {}): InitResult {
	const { cwd = process.cwd(), appDir = "app", uiPath = "ui", workspace = false, skipExisting = true } = options

	const result: InitResult = {
		success: true,
		created: [],
		skipped: [],
		errors: [],
	}

	const appPath = join(cwd, appDir)
	const uiDir = join(appPath, uiPath)
	const storiesDir = join(uiDir, "stories")
	const pageDir = join(uiDir, "[[...path]]")

	// Check if app directory exists
	if (!existsSync(appPath)) {
		result.errors.push(`App directory not found: ${appPath}`)
		result.success = false
		return result
	}

	// Create directories
	const dirs = [uiDir, storiesDir, pageDir]
	for (const dir of dirs) {
		if (!existsSync(dir)) {
			try {
				mkdirSync(dir, { recursive: true })
			} catch (_err) {
				result.errors.push(`Failed to create directory: ${dir}`)
				result.success = false
				return result
			}
		}
	}

	// Files to create
	const files: Array<{ path: string; content: string }> = [
		{
			path: join(uiDir, "layout.tsx"),
			content: replaceImports(templates.layout, workspace),
		},
		{
			path: join(pageDir, "page.tsx"),
			content: replaceImports(templates.page, workspace),
		},
		{
			path: join(storiesDir, "index.ts"),
			content: replaceImports(templates.storiesIndex, workspace),
		},
		{
			path: join(storiesDir, "example.story.tsx"),
			content: replaceImports(templates.exampleStory, workspace),
		},
	]

	// Create files
	for (const file of files) {
		if (existsSync(file.path) && skipExisting) {
			result.skipped.push(file.path)
		} else {
			try {
				writeFileSync(file.path, file.content, "utf-8")
				result.created.push(file.path)
			} catch (_err) {
				result.errors.push(`Failed to write file: ${file.path}`)
				result.success = false
			}
		}
	}

	return result
}
