"use client"

import { useEffect, useState } from "react"
import type { z } from "zod"
import type { ControlConfig, Story } from "../types"
import { getSchemaDefaults, schemaToControls } from "../utils/schema"
import { ControlsPanel } from "./controls-panel"

type StoryViewerProps = {
	loader: () => Promise<Record<string, unknown>>
	exportName: string
	title: string
}

export function StoryViewer({ loader, exportName, title }: StoryViewerProps) {
	const [story, setStory] = useState<Story<z.ZodType | undefined> | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [controls, setControls] = useState<ControlConfig[]>([])
	const [values, setValues] = useState<Record<string, unknown>>({})
	const [defaultValues, setDefaultValues] = useState<Record<string, unknown>>({})

	// Load the story module
	useEffect(() => {
		setLoading(true)
		setError(null)

		loader()
			.then((mod) => {
				const exportedStory = mod[exportName]
				if (exportedStory && typeof exportedStory === "object" && "__nextbook" in exportedStory) {
					setStory(exportedStory as Story<z.ZodType | undefined>)
				} else {
					setError(`Export "${exportName}" not found or not a valid story`)
				}
			})
			.catch((err) => {
				setError(String(err))
			})
			.finally(() => {
				setLoading(false)
			})
	}, [loader, exportName])

	// Extract controls and defaults from schema
	useEffect(() => {
		if (story?.schema) {
			try {
				const schemaControls = schemaToControls(story.schema as z.ZodObject<z.ZodRawShape>)
				const schemaDefaults = getSchemaDefaults(story.schema as z.ZodObject<z.ZodRawShape>)

				setControls(schemaControls)
				setDefaultValues(schemaDefaults)
				setValues(schemaDefaults)
			} catch (err) {
				console.warn("[nextbook] Could not extract controls from schema:", err)
				setControls([])
				setDefaultValues({})
				setValues({})
			}
		} else {
			setControls([])
			setDefaultValues({})
			setValues({})
		}
	}, [story?.schema])

	const handleChange = (name: string, value: unknown) => {
		setValues((prev) => ({ ...prev, [name]: value }))
	}

	const handleReset = () => {
		setValues(defaultValues)
	}

	// Render the story
	const renderStory = () => {
		if (loading) {
			return <div className="text-neutral-500">Loading...</div>
		}

		if (error) {
			return (
				<div className="rounded border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
					<p className="font-medium">Error loading story</p>
					<p className="mt-1 text-sm">{error}</p>
				</div>
			)
		}

		if (!story) {
			return (
				<div className="rounded border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
					<p className="font-medium">Story not found</p>
				</div>
			)
		}

		try {
			if (story.schema) {
				// Story with schema - pass props
				return (story.render as (props: Record<string, unknown>) => React.ReactNode)(values)
			}
			// Simple story - no props
			return (story.render as () => React.ReactNode)()
		} catch (err) {
			console.error("[nextbook] Error rendering story:", err)
			return (
				<div className="rounded border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
					<p className="font-medium">Error rendering story</p>
					<p className="mt-1 text-sm">{String(err)}</p>
				</div>
			)
		}
	}

	return (
		<div className="flex h-full flex-col">
			{/* Header */}
			<header className="flex-shrink-0 border-neutral-200 border-b px-6 py-4 dark:border-neutral-800">
				<h1 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">{title}</h1>
			</header>

			{/* Story canvas */}
			<div className="flex-1 overflow-auto bg-white p-6 dark:bg-neutral-950">
				<div className="flex min-h-full items-start justify-center">
					<div className="rounded-lg border border-neutral-200 border-dashed bg-neutral-50/50 p-8 dark:border-neutral-800 dark:bg-neutral-900/50">
						{renderStory()}
					</div>
				</div>
			</div>

			{/* Controls panel */}
			{controls.length > 0 && (
				<ControlsPanel controls={controls} values={values} onChange={handleChange} onReset={handleReset} />
			)}
		</div>
	)
}
