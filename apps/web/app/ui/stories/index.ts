"use client"

import { createStoryRegistry } from "@workspace/nextbook"

export const { storyTree, loaders } = createStoryRegistry({
	button: () => import("./button.story"),
	forms: {
		input: () => import("./forms/input.story"),
	},
})
