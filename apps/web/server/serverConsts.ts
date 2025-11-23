import "server-only"
import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"
import { consts, env } from "@/lib/consts"

/** You can add another payment processor here you might want to use. Removing the ones you don't use is not required. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const paymentProcessors = ["polar", "stripe"] as const

export type PaymentProcessor = (typeof paymentProcessors)[number]

/** The payment processor to use in new payments. `undefined` means no payments in the app. */
const paymentProcessor = undefined satisfies PaymentProcessor | undefined

/**
 * This is why we separate the `paymentProcessor` from the `serverConsts.payment.processor`,
 * so the first one has the specific type and the second is the union of all the possibilities, which can properly have conditionals.
 */
export type CurrentPaymentProcessor = typeof paymentProcessor

/** Consts that the client must not have access to. */
export const serverConsts = {
	payment: {
		/**
		 * Wheter the user needs to be logged in to make purchases.
		 *
		 * If true, the user don't need an account to make the purchase and an account will be created with the given email upon successful payment if the account doesn't exist yet.
		 *
		 * If false and if the user is not logged it, they will be redirect to `/auth`.
		 */
		allowPurchaseWithoutAuth: false as boolean,

		/** The payment processor to use in new payments. */
		processor: paymentProcessor as PaymentProcessor | undefined,
		/** Used only if you are using Stripe. */
		stripe: {
			/** Automatic taxes calculation by Stripe Tax. You probably want this if it's supported in your country. */
			stripeTaxEnabled: false,
			/**
			 * Create a coupon and add here its ID. You can define its ID with the same coupon name
			 *
			 * instead of letting it generate it so Live and Test mode uses the same string. https://dashboard.stripe.com/coupons
			 */
			defaultCouponId: undefined as string | undefined,
		},
	} as const,

	/** Which integrations are active and which related ENV vars should be required and considered. */
	integrations: {
		/** Note that we need Resend to send Magic Links to do the authentication! This isn't required if your app has no authentication. */
		resend: consts.emailEnabled,
	},

	email: {
		/**
		 * It's recommended to use a subdomain like `updates.myDomain.com` for reputation:
		 * https://resend.com/docs/knowledge-base/is-it-better-to-send-emails-from-a-subdomain-or-the-root-domain
		 * The first part is the name that appear as the sender, the second part is the actual email.
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		 */
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		sender: consts.emailEnabled ? `${consts.appName} <notifications@${env.NEXT_PUBLIC_EMAIL_DOMAIN}>` : undefined,
	},
} as const

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
		DATABASE_URL: z.url(),

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-non-null-assertion
		RESEND_API_KEY: serverConsts.integrations.resend ? process.env.RESEND_API_KEY! : disabledEnv,

		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,

		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
	},
	/** Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. Useful for Docker builds.  */
	skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
	emptyStringAsUndefined: true,
})
