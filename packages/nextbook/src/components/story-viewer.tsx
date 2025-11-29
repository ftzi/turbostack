"use client"

import { useEffect, useState } from "react"
import type { z } from "zod"
import type { ControlConfig, Story } from "../types"
import { cn } from "../utils/cn"
import { getSchemaDefaults, schemaToControls } from "../utils/schema"
import { ControlsPanel } from "./controls-panel"

type BackgroundType = "default" | "striped" | "magenta"

const BACKGROUNDS: { type: BackgroundType; label: string; className: string; style?: React.CSSProperties }[] = [
	{
		type: "default",
		label: "Default",
		className: "bg-neutral-50/50 dark:bg-neutral-900/50",
	},
	{
		type: "striped",
		label: "Striped",
		className: "",
		style: {
			backgroundImage: "repeating-linear-gradient(45deg, #fff, #fff 10px, #e5e5e5 10px, #e5e5e5 20px)",
		},
	},
	{
		type: "magenta",
		label: "Magenta",
		className: "",
		style: { backgroundColor: "#FF00FF" },
	},
]

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
	const [background, setBackground] = useState<BackgroundType>("default")

	// Load the story module
	useEffect(() => {
		setLoading(true)
		setError(null)

		loader()
			.then((mod) => {
				// Case-insensitive export lookup (URLs are lowercase)
				const matchingKey = Object.keys(mod).find((key) => key.toLowerCase() === exportName.toLowerCase())
				const exportedStory = matchingKey ? mod[matchingKey] : undefined

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
			return null
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

	const currentBg = BACKGROUNDS.find((bg) => bg.type === background) ?? BACKGROUNDS[0]

	return (
		<div className="flex h-full flex-col">
			{/* Header */}
			<header className="flex flex-shrink-0 items-center justify-between border-neutral-200 border-b px-6 py-4 dark:border-neutral-800">
				<h1 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">{title}</h1>
				<BackgroundSwitcher value={background} onChange={setBackground} />
			</header>

			{/* Story canvas */}
			<div className="flex-1 overflow-auto bg-white p-6 dark:bg-neutral-950">
				<div className="flex min-h-full items-start justify-center">
					<div
						className={cn(
							"rounded-lg border border-neutral-200 border-dashed p-8 dark:border-neutral-800",
							currentBg?.className,
						)}
						style={currentBg?.style}
					>
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

function BackgroundSwitcher({ value, onChange }: { value: BackgroundType; onChange: (value: BackgroundType) => void }) {
	return (
		<div className="flex items-center gap-1.5">
			{BACKGROUNDS.map((bg) => (
				<button
					key={bg.type}
					type="button"
					onClick={() => onChange(bg.type)}
					className={cn(
						"relative h-7 w-7 overflow-hidden rounded border-2 transition-all",
						value === bg.type
							? "border-neutral-900 ring-2 ring-neutral-900/20 dark:border-neutral-100 dark:ring-neutral-100/20"
							: "border-neutral-300 hover:border-neutral-400 dark:border-neutral-600 dark:hover:border-neutral-500",
					)}
					title={bg.label}
				>
					{bg.type === "default" && (
						<span className="absolute inset-0 flex items-center justify-center bg-neutral-100 font-medium text-[10px] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
							Aa
						</span>
					)}
					{bg.type === "striped" && (
						<span
							className="absolute inset-0"
							style={{
								backgroundImage: "repeating-linear-gradient(45deg, #fff, #fff 2px, #d4d4d4 2px, #d4d4d4 4px)",
							}}
						/>
					)}
					{bg.type === "magenta" && <span className="absolute inset-0" style={{ backgroundColor: "#FF00FF" }} />}
				</button>
			))}
		</div>
	)
}
