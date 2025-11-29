import type { ReactNode } from "react"
import type { z } from "zod"

/**
 * Configuration for a story with optional Zod schema for auto-generated controls.
 *
 * @example
 * // Simple story without controls
 * story({
 *   render: () => <Button>Click me</Button>,
 * })
 *
 * @example
 * // Story with Zod schema for interactive controls
 * story({
 *   schema: z.object({
 *     variant: z.enum(['primary', 'secondary']).default('primary').describe('Button style'),
 *     disabled: z.boolean().default(false).describe('Disabled state'),
 *   }),
 *   render: (props) => <Button {...props}>Click me</Button>,
 * })
 */
export type StoryConfig<TSchema extends z.ZodType | undefined = undefined> = TSchema extends z.ZodType
	? {
			/** Zod schema for auto-generating controls. Use .default() for initial values and .describe() for labels. */
			schema: TSchema
			/** Render function that receives typed props from the schema */
			render: (props: z.output<TSchema>) => ReactNode
		}
	: {
			/** Optional Zod schema - omit for simple stories without controls */
			schema?: undefined
			/** Render function for the story */
			render: () => ReactNode
		}

/**
 * A story object created by the story() function.
 * Contains metadata for Nextbook to detect and render stories.
 */
export type Story<TSchema extends z.ZodType | undefined = undefined> = {
	/** Marker for Nextbook to identify story objects */
	readonly __nextbook: true
	/** The Zod schema (if provided) */
	readonly schema: TSchema
	/** The render function */
	readonly render: TSchema extends z.ZodType ? (props: z.output<TSchema>) => ReactNode : () => ReactNode
}

/**
 * Metadata about a discovered story for the sidebar and routing.
 */
export type StoryMeta = {
	/** Full path segments (e.g., ['Forms', 'Input', 'Primary']) */
	path: string[]
	/** Display name (last segment, capitalized) */
	name: string
	/** File path relative to stories directory */
	filePath: string
	/** Export name in the file */
	exportName: string
}

/**
 * Tree structure for sidebar navigation.
 */
export type StoryTreeNode = {
	/** Display name */
	name: string
	/** URL path segment */
	segment: string
	/** Child nodes (for directories) */
	children?: StoryTreeNode[]
	/** Story metadata (for leaf nodes with discovered exports) */
	story?: StoryMeta
	/** File path for lazy loading (leaf nodes before export discovery) */
	filePath?: string
}

/**
 * Control type for the controls panel.
 */
export type ControlType = "text" | "number" | "boolean" | "select"

/**
 * Configuration for a single control in the controls panel.
 */
export type ControlConfig = {
	/** Control type */
	type: ControlType
	/** Field name/key */
	name: string
	/** Display label (from .describe()) */
	label: string
	/** Default value (from .default()) */
	defaultValue: unknown
	/** Options for select controls */
	options?: string[]
}
