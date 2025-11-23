import { Logo } from "@workspace/ui/components/Logo"
import { ImageResponse } from "next/og"
import { consts } from "@/lib/consts"

// https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#generate-images-using-code-js-ts-tsx
//
// I suggest using this extension to test it: https://chromewebstore.google.com/detail/nggoiohoonibebildpjhlaakfoccpfln?utm_source=item-share-cb
// You can check the generated images by accessing the URL given by the `og-image` & `twitter-image` fields when using the extension.
//
// This is a good source of images references: https://www.opengraph.xyz/inspiration.
//
// You can also use this as a reference or to generate your .png: https://imgsrc.io/
//
// LinkedIn: Use this to check how it looks and to force its update: https://www.linkedin.com/post-inspector/
export const alt = consts.appName

// The recommended size for OpenGraph images is 1200x630 pixels.
export const size = {
	width: 1200,
	height: 630,
}

export const contentType = "image/png"

const fontFamily = "Poppins"
const text = undefined as string | undefined

/** Used both in this file and in the `twitter-image.tsx`, as in it, just the size changes. */
export const getOpengraphImage = async (size: { width: number; height: number }): Promise<ImageResponse> =>
	new ImageResponse(
		<div
			style={{
				backgroundColor: "#040404",
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "column",
				fontFamily,
			}}
		>
			<Logo height={120} />
			{text && (
				<span
					style={{
						color: "white",
						fontSize: 30,
						marginTop: "30px",
					}}
				>
					{text}
				</span>
			)}
		</div>,
		{
			...size,
			fonts: text
				? [
						{
							name: fontFamily,
							data: await loadGoogleFont(fontFamily, text),
						},
					]
				: undefined,
		},
	)

export default async function Image() {
	return getOpengraphImage(size)
}

// https://vercel.com/guides/using-custom-font
const loadGoogleFont = async (font: string, text: string) => {
	const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`
	const css = await (await fetch(url)).text()
	const resource = /src: url\((.+)\) format\('(opentype|truetype)'\)/.exec(css)

	if (resource?.[1]) {
		const response = await fetch(resource[1])

		if (response.status === 200) return await response.arrayBuffer()
		throw new Error("Failed to fetch font resource")
	}
	throw new Error("Failed to access resource?.[1]")
}
