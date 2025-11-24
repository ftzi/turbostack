import { z } from "zod"
import { OG_DEFAULTS, OG_SIZES } from "./og-wrapper"

const defaultOgParamsSchema = z.object({
	type: z.literal("default"),
})

export const ogParamsSchema = z.discriminatedUnion("type", [defaultOgParamsSchema])

export type OgParams = z.infer<typeof ogParamsSchema>
export type DefaultOgParams = z.infer<typeof defaultOgParamsSchema>

export const buildOgImageDescriptor = ({ data, alt }: { data: OgParams; alt?: string }) => {
	const baseUrl = process.env.NEXT_PUBLIC_URL ?? ""
	const searchParams = new URLSearchParams()

	Object.entries(data).forEach(([key, value]) => {
		searchParams.set(key, value as string)
	})

	return {
		url: `${baseUrl}/api/og?${searchParams.toString()}`,
		alt: alt ?? OG_DEFAULTS.alt,
		type: "image/png",
		width: OG_SIZES.opengraph.width,
		height: OG_SIZES.opengraph.height,
	}
}
