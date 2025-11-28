import type { z } from "zod"
import type { Story, StoryConfig } from "./types"

/**
 * Creates a story for Nextbook.
 *
 * @example
 * // Simple story without controls
 * export const Primary = story({
 *   render: () => <Button>Click me</Button>,
 * })
 *
 * @example
 * // Story with Zod schema for interactive controls
 * export const Interactive = story({
 *   schema: z.object({
 *     variant: z.enum(['primary', 'secondary']).default('primary').describe('Button style'),
 *     disabled: z.boolean().default(false).describe('Disabled state'),
 *   }),
 *   render: (props) => <Button {...props}>Click me</Button>,
 * })
 *
 * @param config - Story configuration with optional schema and required render function
 * @returns A story object that Nextbook can detect and render
 */
export function story<TSchema extends z.ZodType | undefined = undefined>(config: StoryConfig<TSchema>): Story<TSchema> {
	return {
		__nextbook: true,
		schema: config.schema as TSchema,
		render: config.render as Story<TSchema>["render"],
	}
}

/**
 * Type guard to check if a value is a Nextbook story.
 */
export function isStory(value: unknown): value is Story<z.ZodType | undefined> {
	return typeof value === "object" && value !== null && "__nextbook" in value && value.__nextbook === true
}
