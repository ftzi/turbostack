import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

/** Whether email functionality is enabled in the app. */
const emailEnabled = false as boolean

/** To be used in the place of a disabled/undefined env var if it's required where used. */
const disabledEnv = "DISABLED"

/** Consts used by the client and server. */
export const consts = {
	appName: "MyProject",
	description: "My Project Description",

	/** Whether email functionality is enabled. */
	emailEnabled,

	/**
	 * Either 'light' or 'dark'. It depends on your app's design and your users' preferences.
	 *
	 * I don't recommend spending time and effort supporting both if you are not already making some good money with the app,
	 * as you would need to check every addition to the app to make sure it works on both themes.
	 */
	// defaultColorScheme: "dark",

	// socialMediaLinks: {
	//   youtube: "https://www.youtube.com/@",
	//   discord: "https://discord.com/invite/",
	//   instagram: "https://www.instagram.com/",
	//   x: "https://x.com/",
	// } satisfies Partial<Record<SocialMedia, string>>,

	email: {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		contact: emailEnabled ? `contact@${process.env.NEXT_PUBLIC_EMAIL_DOMAIN!}` : undefined,
	},

	/** Where to redirect to after a successful authentication. */
	pathWhenLoggedIn: "/app",
} as const

/**
 * Public env vars. This is separated from the `serverEnv` so the `serverEnv` can use `serverConsts` to make some vars required or not.
 */
export const env = createEnv({
	shared: {
		/**
		 * Automatically set by Next.js. `production` when built (= `bun run build && bun start`) and
		 * `development` when running locally (= `bun dev`). Testing tools might set it to `test`.
		 */
		NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
	},
	/**
	 * Specify your client-side environment variables schema here. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
	 */
	client: {
		/**
		 * For production, this will be like `https://my-project.com`.
		 * For preview builds, this will be like `https://my-project-haxgx9yob-myTeam.vercel.app`.
		 * For development, it's `http://localhost:3000`
		 */
		NEXT_PUBLIC_URL: z.url(),

		NEXT_PUBLIC_EMAIL_DOMAIN: (emailEnabled ? z.string().min(1) : z.string().optional()) as z.ZodString,
	},
	/**
	 * Due to how Next.js bundles environment variables on Edge and Client,
	 * we need to manually destructure them to make sure all are included in bundle.
	 */
	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		NEXT_PUBLIC_URL:
			process.env.NEXT_PUBLIC_URL ?? // Production URL you set
			(process.env.NEXT_PUBLIC_VERCEL_URL
				? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` // Preview URL automatically set by Vercel
				: "http://localhost:3000"), // Local Development URL
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		NEXT_PUBLIC_EMAIL_DOMAIN: (emailEnabled ? process.env.NEXT_PUBLIC_EMAIL_DOMAIN : disabledEnv)!,
	},
	/** Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. Useful for Docker builds.  */
	skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
})

/** This is `true` when running locally (= `bun dev`) and `false` when deployed (= `bun run build && bun start`) */
export const isDevelopment = env.NODE_ENV === "development"
