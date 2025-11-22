import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

import { DefaultOG } from "@/lib/opengraph/default-og";
import { ogParamsSchema } from "@/lib/opengraph/og-params";
import { OG_SIZES } from "@/lib/opengraph/og-wrapper";

export const revalidate = 3600;

/**
 * To use custom fonts in OG images:
 *
 * 1. Download font files (e.g., .ttf format) and place them in `public/fonts/`
 *    Example for Inter font:
 *    - curl -o public/fonts/Inter-Bold.ttf https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Bold.ttf
 *    - curl -o public/fonts/Inter-SemiBold.ttf https://github.com/rsms/inter/raw/master/docs/font-files/Inter-SemiBold.ttf
 *
 * 2. Add required imports and create a font loader helper:
 *    ```
 *    import { readFile } from "node:fs/promises";
 *    import { join } from "node:path";
 *
 *    type InterFontWeight = 600 | 700;
 *
 *    const INTER_FONTS: Record<InterFontWeight, { file: string; cache?: Promise<Buffer> }> = {
 *      700: { file: "Inter-Bold.ttf" },
 *      600: { file: "Inter-SemiBold.ttf" },
 *    };
 *
 *    const loadInterFont = (weight: InterFontWeight): Promise<Buffer> => {
 *      if (INTER_FONTS[weight].cache) {
 *        return INTER_FONTS[weight].cache;
 *      }
 *
 *      const fontPath = join(process.cwd(), "public", "fonts", INTER_FONTS[weight].file);
 *      const promise = readFile(fontPath);
 *
 *      INTER_FONTS[weight].cache = promise;
 *      return promise;
 *    };
 *
 *    const getInterFonts = async (weights: readonly InterFontWeight[]) => {
 *      const fontData = await Promise.all(weights.map((w) => loadInterFont(w)));
 *      return fontData.map((data, i) => ({
 *        name: "Inter",
 *        data,
 *        weight: weights[i],
 *        style: "normal" as const,
 *      }));
 *    };
 *    ```
 *
 * 3. Pass fonts to ImageResponse options:
 *    ```
 *    return new ImageResponse(
 *      <YourComponent />,
 *      {
 *        ...OG_SIZES.opengraph,
 *        fonts: await getInterFonts([600, 700]),
 *      }
 *    );
 *    ```
 */

const createDefaultOGResponse = () => new ImageResponse(<DefaultOG />, OG_SIZES.opengraph);

export const GET = async (request: NextRequest) => {
	try {
		const { searchParams } = new URL(request.url);

		const rawParams = Object.fromEntries(searchParams.entries());
		const validationResult = ogParamsSchema.safeParse(rawParams);

		if (!validationResult.success) {
			console.error("Invalid OG params:", validationResult.error);
			return createDefaultOGResponse();
		}

		const params = validationResult.data;

		switch (params.type) {
			case "default":
				return createDefaultOGResponse();
		}
	} catch (error) {
		console.error("Error generating OG image:", error);
		return createDefaultOGResponse();
	}
};
