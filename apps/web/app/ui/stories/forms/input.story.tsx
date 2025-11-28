import { story } from "@workspace/nextbook"
import { Input } from "@workspace/ui/components/input"
import { z } from "zod"

/**
 * Input component stories.
 * Demonstrates various input types and states.
 */

export const Default = story({
	render: () => <Input placeholder="Enter text..." />,
})

export const WithValue = story({
	render: () => <Input defaultValue="Hello, World!" />,
})

export const Password = story({
	render: () => <Input type="password" placeholder="Enter password..." />,
})

export const Email = story({
	render: () => <Input type="email" placeholder="email@example.com" />,
})

export const NumberInput = story({
	render: () => <Input type="number" placeholder="0" />,
})

export const Disabled = story({
	render: () => <Input disabled placeholder="Disabled input" />,
})

export const WithFile = story({
	render: () => <Input type="file" />,
})

/**
 * Interactive input with controls.
 * Demonstrates Zod schema integration.
 */
export const Interactive = story({
	schema: z.object({
		type: z.enum(["text", "password", "email", "number", "tel", "url"]).default("text").describe("Input type"),
		placeholder: z.string().default("Enter value...").describe("Placeholder text"),
		disabled: z.boolean().default(false).describe("Disabled state"),
	}),
	render: (props) => <Input {...props} />,
})
