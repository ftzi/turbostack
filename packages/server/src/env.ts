import "server-only"
import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"
import { serverConsts } from "./consts"

/** To be used in the place of a disabled/undefined env var if it's required where used. */
export const disabledEnv = "DISABLED"

/**
 * Server-only env vars. While `@t3-oss/env-nextjs` intends to have both server and client env in the same `createEnv`,
 * this hides in the browser code the env vars names we use in the server and we can also use serverConsts here to require or not some env vars.
 */
export const serverEnv = createEnv({
	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		DATABASE_URL: z.string().min(1),
		DB_CLIENT: z.enum(["postgres", "sqlite"]).default("postgres"),

		RESEND_API_KEY: serverConsts.integrations.resend ? z.string().min(1) : z.string().optional(),

		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url().optional(),

		GOOGLE_CLIENT_ID: z.string().min(1),
		GOOGLE_CLIENT_SECRET: z.string().min(1),
	},
	/**
	 * Due to how Next.js bundles environment variables on Edge and Client,
	 * we need to manually destructure them to make sure all are included in bundle.
	 */
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		DB_CLIENT: process.env.DB_CLIENT,
		RESEND_API_KEY: serverConsts.integrations.resend ? process.env.RESEND_API_KEY : disabledEnv,

		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,

		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	},
	/** Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. Useful for Docker builds.  */
	skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
	emptyStringAsUndefined: true,
})
