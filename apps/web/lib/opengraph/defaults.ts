import { Metadata } from "next";
import { buildOGImageDescriptor } from "./og-params";
/**
 * Default metadata values
 */
export const DEFAULT_METADATA = {
	description: "My Project Description",
};

/**
 * Default OpenGraph metadata shared across all pages
 * Use with spread operator: { ...DEFAULT_OPENGRAPH, title: "...", description: "..." }
 */
export const DEFAULT_OPENGRAPH: Metadata["openGraph"] = {
	title: "MyProject",
	description: DEFAULT_METADATA.description,
	siteName: "MyProject",
	url: process.env.NEXT_PUBLIC_URL,
	type: "website" as const,
	locale: "en_US",
	images: [
		buildOGImageDescriptor({
			data: { type: "default" },
		}),
	],
};
