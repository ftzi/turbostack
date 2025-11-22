import { z } from "zod";
import { OG_DEFAULTS, OG_SIZES } from "./og-wrapper";

const defaultOGParamsSchema = z.object({
	type: z.literal("default"),
});

export const ogParamsSchema = z.discriminatedUnion("type", [defaultOGParamsSchema]);

export type OGParams = z.infer<typeof ogParamsSchema>;
export type DefaultOGParams = z.infer<typeof defaultOGParamsSchema>;

export const buildOGImageDescriptor = ({ data, alt }: { data: OGParams; alt?: string }) => {
	const baseUrl = process.env.NEXT_PUBLIC_URL || "";
	const searchParams = new URLSearchParams();

	Object.entries(data).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			searchParams.set(key, String(value));
		}
	});

	return {
		url: `${baseUrl}/api/og?${searchParams.toString()}`,
		alt: alt || OG_DEFAULTS.alt,
		type: "image/png",
		width: OG_SIZES.opengraph.width,
		height: OG_SIZES.opengraph.height,
	};
};
