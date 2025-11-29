import { afterEach, beforeEach, describe, expect, test } from "bun:test"
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { init } from "./init"

const TEST_DIR = join(import.meta.dir, ".test-tmp")

describe("nextbook init", () => {
	beforeEach(() => {
		// Clean up and create fresh test directory
		if (existsSync(TEST_DIR)) {
			rmSync(TEST_DIR, { recursive: true })
		}
		mkdirSync(TEST_DIR, { recursive: true })
	})

	afterEach(() => {
		// Clean up after tests
		if (existsSync(TEST_DIR)) {
			rmSync(TEST_DIR, { recursive: true })
		}
	})

	test("fails if app directory does not exist", () => {
		const result = init({ cwd: TEST_DIR })

		expect(result.success).toBe(false)
		expect(result.errors).toContain(`App directory not found: ${join(TEST_DIR, "app")}`)
	})

	test("creates all required files", () => {
		// Create app directory
		mkdirSync(join(TEST_DIR, "app"), { recursive: true })

		const result = init({ cwd: TEST_DIR })

		expect(result.success).toBe(true)
		expect(result.errors).toHaveLength(0)
		expect(result.created).toHaveLength(4)

		// Verify files exist
		expect(existsSync(join(TEST_DIR, "app/ui/layout.tsx"))).toBe(true)
		expect(existsSync(join(TEST_DIR, "app/ui/[[...path]]/page.tsx"))).toBe(true)
		expect(existsSync(join(TEST_DIR, "app/ui/stories/index.ts"))).toBe(true)
		expect(existsSync(join(TEST_DIR, "app/ui/stories/example.story.tsx"))).toBe(true)
	})

	test("uses npm imports by default", () => {
		mkdirSync(join(TEST_DIR, "app"), { recursive: true })

		init({ cwd: TEST_DIR })

		const layout = readFileSync(join(TEST_DIR, "app/ui/layout.tsx"), "utf-8")
		expect(layout).toContain('from "nextbook"')
		expect(layout).not.toContain("@workspace/nextbook")
	})

	test("uses workspace imports when --workspace flag is set", () => {
		mkdirSync(join(TEST_DIR, "app"), { recursive: true })

		init({ cwd: TEST_DIR, workspace: true })

		const layout = readFileSync(join(TEST_DIR, "app/ui/layout.tsx"), "utf-8")
		expect(layout).toContain('from "@workspace/nextbook"')
	})

	test("skips existing files by default", () => {
		mkdirSync(join(TEST_DIR, "app/ui"), { recursive: true })

		// Create an existing file
		const existingContent = "// existing content"
		writeFileSync(join(TEST_DIR, "app/ui/layout.tsx"), existingContent)

		const result = init({ cwd: TEST_DIR })

		expect(result.success).toBe(true)
		expect(result.skipped).toContain(join(TEST_DIR, "app/ui/layout.tsx"))

		// Verify existing file was not overwritten
		const content = readFileSync(join(TEST_DIR, "app/ui/layout.tsx"), "utf-8")
		expect(content).toBe(existingContent)
	})

	test("overwrites existing files when skipExisting is false", () => {
		mkdirSync(join(TEST_DIR, "app/ui"), { recursive: true })

		// Create an existing file
		writeFileSync(join(TEST_DIR, "app/ui/layout.tsx"), "// existing content")

		const result = init({ cwd: TEST_DIR, skipExisting: false })

		expect(result.success).toBe(true)
		expect(result.created).toContain(join(TEST_DIR, "app/ui/layout.tsx"))

		// Verify file was overwritten
		const content = readFileSync(join(TEST_DIR, "app/ui/layout.tsx"), "utf-8")
		expect(content).toContain("NextbookShell")
	})

	test("creates correct directory structure", () => {
		mkdirSync(join(TEST_DIR, "app"), { recursive: true })

		init({ cwd: TEST_DIR })

		expect(existsSync(join(TEST_DIR, "app/ui"))).toBe(true)
		expect(existsSync(join(TEST_DIR, "app/ui/stories"))).toBe(true)
		expect(existsSync(join(TEST_DIR, "app/ui/[[...path]]"))).toBe(true)
	})

	test("layout contains NextbookShell", () => {
		mkdirSync(join(TEST_DIR, "app"), { recursive: true })

		init({ cwd: TEST_DIR })

		const layout = readFileSync(join(TEST_DIR, "app/ui/layout.tsx"), "utf-8")
		expect(layout).toContain("NextbookShell")
		expect(layout).toContain("storyTree")
		expect(layout).toContain("loaders")
		expect(layout).toContain("export default function")
	})

	test("page contains StoryPage component", () => {
		mkdirSync(join(TEST_DIR, "app"), { recursive: true })

		init({ cwd: TEST_DIR })

		const page = readFileSync(join(TEST_DIR, "app/ui/[[...path]]/page.tsx"), "utf-8")
		expect(page).toContain("StoryPage")
		expect(page).toContain("storyTree")
		expect(page).toContain("loaders")
		expect(page).toContain("params")
		expect(page).toContain("path")
	})

	test("stories index uses createStoryRegistry", () => {
		mkdirSync(join(TEST_DIR, "app"), { recursive: true })

		init({ cwd: TEST_DIR })

		const index = readFileSync(join(TEST_DIR, "app/ui/stories/index.ts"), "utf-8")
		expect(index).toContain("createStoryRegistry")
		expect(index).toContain("storyTree")
		expect(index).toContain("loaders")
		expect(index).toContain("example.story")
	})

	test("example story uses story() function", () => {
		mkdirSync(join(TEST_DIR, "app"), { recursive: true })

		init({ cwd: TEST_DIR })

		const story = readFileSync(join(TEST_DIR, "app/ui/stories/example.story.tsx"), "utf-8")
		expect(story).toContain("story({")
		expect(story).toContain("render:")
		expect(story).toContain("export const Default")
		expect(story).toContain("export const WithControls")
	})

	test("supports custom app directory", () => {
		mkdirSync(join(TEST_DIR, "src/app"), { recursive: true })

		const result = init({ cwd: TEST_DIR, appDir: "src/app" })

		expect(result.success).toBe(true)
		expect(existsSync(join(TEST_DIR, "src/app/ui/layout.tsx"))).toBe(true)
	})

	test("supports custom ui path", () => {
		mkdirSync(join(TEST_DIR, "app"), { recursive: true })

		const result = init({ cwd: TEST_DIR, uiPath: "storybook" })

		expect(result.success).toBe(true)
		expect(existsSync(join(TEST_DIR, "app/storybook/layout.tsx"))).toBe(true)
	})
})
