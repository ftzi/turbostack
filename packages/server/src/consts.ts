import "server-only"
import { consts, emailEnabled } from "@workspace/shared/consts"
import { env } from "@workspace/shared/env"

/** You can add another payment processor here you might want to use. Removing the ones you don't use is not required. */
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
		resend: emailEnabled,
	},

	email: {
		/**
		 * It's recommended to use a subdomain like `updates.myDomain.com` for reputation:
		 * https://resend.com/docs/knowledge-base/is-it-better-to-send-emails-from-a-subdomain-or-the-root-domain
		 * The first part is the name that appear as the sender, the second part is the actual email.
		 */
		sender: emailEnabled ? `${consts.appName} <notifications@${env.NEXT_PUBLIC_EMAIL_DOMAIN}>` : undefined,
	},
} as const
