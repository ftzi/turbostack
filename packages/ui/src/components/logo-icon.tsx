import type { SVGProps } from "react"
import LogoIconComponent from "../svgs/logo.svg"

/** This is a util quick usage component that uses the @/lib/resources/icon.svg. */
export const LogoIcon = (props: SVGProps<SVGElement>) => (
	<LogoIconComponent height={24} color="inherit" shapeRendering="geometricPrecision" {...props} />
)
