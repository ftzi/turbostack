import "server-only"
import { createEmailSender, MagicLinkEmail } from "@workspace/email"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { magicLink } from "better-auth/plugins"
import { consts, env } from "./consts.js"
import { db } from "./db/index.js"
import { serverConsts, serverEnv } from "./serverConsts.js"

if (!serverConsts.email.sender) {
	throw new Error("Email sender not configured")
}
if (!serverEnv.RESEND_API_KEY) {
	throw new Error("RESEND_API_KEY not configured")
}

const emailSender = createEmailSender({
	apiKey: serverEnv.RESEND_API_KEY,
	from: serverConsts.email.sender,
})

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		usePlural: true,
	}),
	emailAndPassword: {
		enabled: false,
	},
	socialProviders: {
		google: {
			clientId: serverEnv.GOOGLE_CLIENT_ID,
			clientSecret: serverEnv.GOOGLE_CLIENT_SECRET,
		},
	},
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
		magicLink({
			sendMagicLink: async ({ email: userEmail, token, url }) => {
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
			},
		}),
		// Reference: https://www.better-auth.com/docs/integrations/next#server-action-cookies
		nextCookies(),
	],
	secret: serverEnv.BETTER_AUTH_SECRET,
	baseURL: serverEnv.BETTER_AUTH_URL ?? env.NEXT_PUBLIC_URL,
})

export type Session = typeof auth.$Infer.Session.session
export type User = typeof auth.$Infer.Session.user
