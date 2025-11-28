"use client"

import type { ControlConfig } from "../types"
import { cn } from "../utils/cn"

type ControlsPanelProps = {
	controls: ControlConfig[]
	values: Record<string, unknown>
	onChange: (name: string, value: unknown) => void
	onReset: () => void
}

export function ControlsPanel({ controls, values, onChange, onReset }: ControlsPanelProps) {
	if (controls.length === 0) {
		return null
	}

	return (
		<div className="border-neutral-200 border-t bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
			<div className="flex items-center justify-between border-neutral-200 border-b px-4 py-2 dark:border-neutral-800">
				<span className="font-medium text-neutral-700 text-sm dark:text-neutral-300">Controls</span>
				<button
					type="button"
					onClick={onReset}
					className="text-neutral-500 text-xs transition-colors hover:text-neutral-700 dark:hover:text-neutral-300"
				>
					Reset
				</button>
			</div>
			<div className="max-h-64 space-y-4 overflow-y-auto p-4">
				{controls.map((control) => (
					<ControlField
						key={control.name}
						control={control}
						value={values[control.name]}
						onChange={(value) => onChange(control.name, value)}
					/>
				))}
			</div>
		</div>
	)
}

type ControlFieldProps = {
	control: ControlConfig
	value: unknown
	onChange: (value: unknown) => void
}

function ControlField({ control, value, onChange }: ControlFieldProps) {
	const { type, name, label } = control

	return (
		<div className="space-y-1">
			<label htmlFor={`control-${name}`} className="block font-medium text-neutral-600 text-xs dark:text-neutral-400">
				{label}
			</label>
			{type === "text" && (
				<input
					id={`control-${name}`}
					type="text"
					value={String(value ?? "")}
					onChange={(e) => onChange(e.target.value)}
					className={cn(
						"w-full rounded border px-2 py-1.5 text-sm",
						"border-neutral-300 dark:border-neutral-600",
						"bg-white dark:bg-neutral-800",
						"text-neutral-900 dark:text-neutral-100",
						"focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500",
					)}
				/>
			)}
			{type === "number" && (
				<input
					id={`control-${name}`}
					type="number"
					value={Number(value ?? 0)}
					onChange={(e) => onChange(Number(e.target.value))}
					className={cn(
						"w-full rounded border px-2 py-1.5 text-sm",
						"border-neutral-300 dark:border-neutral-600",
						"bg-white dark:bg-neutral-800",
						"text-neutral-900 dark:text-neutral-100",
						"focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500",
					)}
				/>
			)}
			{type === "boolean" && (
				<button
					type="button"
					id={`control-${name}`}
					onClick={() => onChange(!value)}
					className={cn(
						"relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
						value ? "bg-blue-500" : "bg-neutral-300 dark:bg-neutral-600",
					)}
				>
					<span
						className={cn(
							"inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
							value ? "translate-x-6" : "translate-x-1",
						)}
					/>
				</button>
			)}
			{type === "select" && control.options && (
				<select
					id={`control-${name}`}
					value={String(value ?? "")}
					onChange={(e) => onChange(e.target.value)}
					className={cn(
						"w-full rounded border px-2 py-1.5 text-sm",
						"border-neutral-300 dark:border-neutral-600",
						"bg-white dark:bg-neutral-800",
						"text-neutral-900 dark:text-neutral-100",
						"focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500",
					)}
				>
					{control.options.map((option) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</select>
			)}
		</div>
	)
}
