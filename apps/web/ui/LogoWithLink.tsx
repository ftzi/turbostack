import { consts } from "@workspace/api/consts"
import { Logo } from "@workspace/ui/components/Logo.js"
import Link from "next/link"
import type { SVGProps } from "react"

/**
 * Quick usage component that uses the @/lib/resources/logo.svg and links to home.
 *
 * If you want to use the logo without the Link component (If you for example want to use the ImageResponse,
 * which doesn't allow the Link component), use the LogoComponent directly.
 */

export const LogoWithLink = ({ href = "/", ...props }: SVGProps<SVGElement>) => (
	<Link href={href} aria-label={`Go to ${consts.appName} home`}>
		<Logo aria-hidden="true" {...props} />
	</Link>
)
