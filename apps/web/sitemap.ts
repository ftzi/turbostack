import { env } from "@workspace/shared/consts"
import type { MetadataRoute } from "next"
import { publicPaths } from "@/lib/publicRoutes"

/**
 * This is a special Next.js file which helps Search Engine to index your website.
 *
 * You can see the resulting file by accessing /sitemap.xml on your domain,
 * such as https://localhost:3000/sitemap.xml if running locally.
 *
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
	return [
		...(publicPaths
			.filter((route) => !route.noSitemap)
			.map((route) => ({
				url: new URL(route.href, env.NEXT_PUBLIC_URL).href,
				changeFrequency: route.changeFrequency,
				priority: route.priority,
				alternates: route.alternates,
				images: route.images,
				lastModified: route.lastModified ?? new Date(),
				videos: route.videos,
			})) as MetadataRoute.Sitemap),
		// Manually add here other routes you might have that are not included in the public routes, if you have a reason to do so.
	]
}
