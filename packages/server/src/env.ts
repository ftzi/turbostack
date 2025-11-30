import "server-only"
import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

/**
 * Whether we're in local development mode (no DATABASE_URL set).
 * When true, most env vars become optional to enable zero-config local development.
 */
const isLocalDev = !process.env.DATABASE_URL

/**
 * Server-only env vars. While `@t3-oss/env-nextjs` intends to have both server and client env in the same `createEnv`,
 * this hides in the browser code the env vars names we use in the server.
 *
 * In local development mode (no DATABASE_URL), most vars are optional to enable zero-config setup.
 * In production mode (DATABASE_URL set), critical vars are required.
 */
export const serverEnv = createEnv({
	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		// Database: optional for local dev (uses PGlite), required for production
		DATABASE_URL: isLocalDev ? z.string().optional() : z.url(),

		// Email: always optional, magic links will console.log if not set
		RESEND_API_KEY: z.string().min(1).optional(),

		// Auth secret: optional for local dev (uses dev secret with warning), required for production
		BETTER_AUTH_SECRET: isLocalDev ? z.string().min(32).optional() : z.string().min(32),
		BETTER_AUTH_URL: z.url().optional(),

		// OAuth: optional - Google OAuth only enabled when credentials provided
		GOOGLE_CLIENT_ID: z.string().min(1).optional(),
		GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),

		// PGlite: optional directory path for local database storage
		PGLITE_DIR: z.string().optional(),
	},
	/**
	 * Due to how Next.js bundles environment variables on Edge and Client,
	 * we need to manually destructure them to make sure all are included in bundle.
	 */
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		RESEND_API_KEY: process.env.RESEND_API_KEY,

		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,

		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

		PGLITE_DIR: process.env.PGLITE_DIR,
	},
	/** Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. Useful for Docker builds.  */
	skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
	emptyStringAsUndefined: true,
})

/** Whether we're in local development mode (using PGlite) */
export { isLocalDev }
