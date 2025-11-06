import type { MetadataRoute } from "next";

export type Href = `/${string}`;

export type Nav = {
  label: string;
  href: Href;
};

type PublicRoute = Nav &
  (
    | (Omit<MetadataRoute.Sitemap[number], "url"> & { noSitemap?: false })
    | {
        /** If true, this public route won't be added to the sitemaps.xml. */
        noSitemap: true;
      }
  );

/**
 * This servers some purposes:
 *
 * 1) In the sitemap.ts file to generate the sitemap, which should consider all the public routes.
 *
 * 2) In the middleware.ts file, any route not defined here is considered to be protected, requiring the user to be logged in.
 * If the user is not logged in, they are redirected to the auth page.
 *
 * 3) To easily keep the Header and Footer links and their names in sync in a single place, for public routes.
 *
 * The `priority` and `changeFrequency`, for the sitemap, are not really considered by search engines, but might serve somehow as hints to them.
 *
 * We default `lastModified` to `new Date()` in the sitemap.ts.
 */
export const publicRoutes = {
  home: {
    label: "Home",
    href: "/",
    changeFrequency: "weekly",
    priority: 1,
  },
  features: {
    label: "Features",
    href: "/#features",
  },
  pricing: {
    label: "Pricing",
    href: "/#pricing",
  },
  faq: {
    label: "FAQ",
    href: "/#faq",
  },

  affiliates: {
    label: "Affiliates",
    href: "/affiliates",
    changeFrequency: "monthly",
    priority: 0.8,
  },

  terms: {
    label: "Terms of Service",
    href: "/terms",
    changeFrequency: "yearly",
    priority: 0,
  },
  privacy: {
    label: "Privacy Policy",
    href: "/privacy",
    changeFrequency: "yearly",
    priority: 0,
  },

  auth: {
    label: "Authenticate",
    href: "/auth",
    noSitemap: true,
  },
} satisfies Record<string, PublicRoute>;

export type PublicPath =
  (typeof publicRoutes)[keyof typeof publicRoutes]["href"];

/** Doesn't include URL fragments (e.g.: `/#faq`). */
export const publicPaths = Object.values(
  publicRoutes as Record<string, PublicRoute>,
).filter((route) => !route.href.includes("#"));
