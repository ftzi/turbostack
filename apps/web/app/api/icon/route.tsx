import { LogoIcon } from "@workspace/ui/components/LogoIcon"
import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const revalidate = 3600

const ICON_SIZE = {
	width: 32,
	height: 32,
}

type Theme = "light" | "dark"

const getTheme = (searchParams: URLSearchParams): Theme => {
	const theme = searchParams.get("theme")
	return theme === "dark" ? "dark" : "light"
}

const THEME_CONFIG: Record<Theme, { background: string }> = {
	light: { background: "black" },
	dark: { background: "white" },
}

export const GET = (request: NextRequest) => {
	const { searchParams } = new URL(request.url)
	const theme = getTheme(searchParams)
	const config = THEME_CONFIG[theme]

	return new ImageResponse(
		<div
			style={{
				background: config.background,
				borderRadius: "50%",
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<LogoIcon />
		</div>,
		ICON_SIZE,
	)
}

export const contentType = "image/png"
