import "server-only"
import { MagicLinkEmail } from "@workspace/email/emails/magic-link"
import { createEmailSender } from "@workspace/email/send"
import { serverConsts } from "@workspace/server/consts"
import { db } from "@workspace/server/db"
import { serverEnv } from "@workspace/server/env"
import { consts } from "@workspace/shared/consts"
import { env } from "@workspace/shared/env"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { magicLink } from "better-auth/plugins"

// Flexible configuration based on available credentials
const hasGoogleOAuth = Boolean(serverEnv.GOOGLE_CLIENT_ID && serverEnv.GOOGLE_CLIENT_SECRET)
const hasResend = Boolean(serverEnv.RESEND_API_KEY && serverConsts.email.sender)
const hasSecret = Boolean(serverEnv.BETTER_AUTH_SECRET)

// Development secret warning
const DEV_SECRET = "dev-secret-do-not-use-in-production-minimum-32-chars"
if (!hasSecret) {
	console.warn("⚠️  BETTER_AUTH_SECRET not set - using dev secret (not secure for production)")
}

// Create email sender only if Resend is configured
const emailSender =
	hasResend && serverEnv.RESEND_API_KEY && serverConsts.email.sender
		? createEmailSender({
				apiKey: serverEnv.RESEND_API_KEY,
				from: serverConsts.email.sender,
			})
		: null

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		usePlural: true,
	}),
	// Email/password: enabled as fallback when no OAuth available
	emailAndPassword: {
		enabled: !hasGoogleOAuth,
	},
	// Google OAuth: enabled only when credentials provided
	socialProviders:
		hasGoogleOAuth && serverEnv.GOOGLE_CLIENT_ID && serverEnv.GOOGLE_CLIENT_SECRET
			? {
					google: {
						clientId: serverEnv.GOOGLE_CLIENT_ID,
						clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
					},
				}
			: {},
	// Reference: https://www.better-auth.com/docs/guides/optimizing-for-performance#caching
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // Cache session in cookie for 5 minutes to reduce DB queries
		},
	},
	user: {
		// Reference: https://www.better-auth.com/docs/concepts/typescript#additional-fields
		additionalFields: {
			role: {
				type: "string",
				required: false,
				defaultValue: "user",
				input: false, // Don't allow users to set their own role
			},
		},
	},
	plugins: [
		// Magic link: always available, delivery method varies
		magicLink({
			sendMagicLink: async ({ email: userEmail, token, url }) => {
				if (emailSender) {
					// Send via Resend
					await emailSender.sendEmail({
						to: userEmail,
						subject: `Log in to ${consts.appName}`,
						template: MagicLinkEmail({
							token,
							magicLink: url,
							appName: consts.appName,
							appUrl: env.NEXT_PUBLIC_URL,
						}),
					})
				} else {
					// Console log for local development
					console.log(`\n🔗 Magic link for ${userEmail}:`)
					console.log(`   ${url}`)
					console.log(`   Token: ${token}\n`)
				}
			},
		}),
		// Reference: https://www.better-auth.com/docs/integrations/next#server-action-cookies
		nextCookies(),
	],
	secret: serverEnv.BETTER_AUTH_SECRET ?? DEV_SECRET,
	baseURL: serverEnv.BETTER_AUTH_URL ?? env.NEXT_PUBLIC_URL,
})

export type Session = typeof auth.$Infer.Session.session
export type User = typeof auth.$Infer.Session.user
