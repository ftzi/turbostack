import { env } from "@workspace/api/consts"
import type { MetadataRoute } from "next"

/**
 * This is a special Next.js file which tells search engine crawlers whether they can access a file or not.
 *
 * You can see the resulting file by accessing /robots.txt on your domain,
 * such as https://localhost:3000/robots.txt if running locally.
 *
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: new URL("sitemap.xml", env.NEXT_PUBLIC_URL).href,
		host: env.NEXT_PUBLIC_URL,
	}
}
