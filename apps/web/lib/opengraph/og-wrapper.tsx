import type { CSSProperties, ReactNode } from "react"

export const OG_SIZES = {
	opengraph: { width: 1200, height: 630 },
	twitter: { width: 1200, height: 675 },
} as const

export const OG_DEFAULTS = {
	alt: "MyProject",
	revalidate: 3600,
} as const

type OgWrapperProps = {
	children: ReactNode
	style?: CSSProperties
}

/**
 * Standard wrapper for OpenGraph images with consistent styling
 * White background, centered flex layout with Inter font
 * Use this for consistent OG image styling across the app
 */
export const OgWrapper = ({ children, style }: OgWrapperProps) => (
	<div
		style={{
			backgroundColor: "#FFF",
			width: "100%",
			height: "100%",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			flexDirection: "column",
			fontFamily: "Inter",
			...style,
		}}
	>
		{children}
	</div>
)
