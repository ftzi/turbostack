import { story } from "@workspace/nextbook"
import { Button } from "@workspace/ui/components/button"
import { z } from "zod"

/**
 * Button component stories.
 * Demonstrates various button variants and sizes.
 */

export const Default = story({
	render: () => <Button>Click me</Button>,
})

export const Secondary = story({
	render: () => <Button variant="secondary">Secondary</Button>,
})

export const Destructive = story({
	render: () => <Button variant="destructive">Delete</Button>,
})

export const Outline = story({
	render: () => <Button variant="outline">Outline</Button>,
})

export const Ghost = story({
	render: () => <Button variant="ghost">Ghost</Button>,
})

export const Link = story({
	render: () => <Button variant="link">Link Button</Button>,
})

export const Small = story({
	render: () => <Button size="sm">Small</Button>,
})

export const Large = story({
	render: () => <Button size="lg">Large</Button>,
})

export const Disabled = story({
	render: () => <Button disabled>Disabled</Button>,
})

/**
 * Interactive button with controls.
 * Demonstrates Zod schema integration.
 */
export const Interactive = story({
	schema: z.object({
		variant: z
			.enum(["default", "secondary", "destructive", "outline", "ghost", "link"])
			.default("default")
			.describe("Button variant"),
		size: z.enum(["default", "sm", "lg"]).default("default").describe("Button size"),
		disabled: z.boolean().default(false).describe("Disabled state"),
		children: z.string().default("Interactive Button").describe("Button text"),
	}),
	render: (props) => <Button {...props} />,
})
