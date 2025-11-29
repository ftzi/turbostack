import type { SVGProps } from "react"
import LogoComponentSvg from "@/lib/resources/logo.svg"

export const Logo = (props: SVGProps<SVGElement>) => (
	<LogoComponentSvg height={30} shapeRendering="geometricPrecision" {...props} />
)
