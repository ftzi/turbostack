import "server-only";
import { createEmailSender, MagicLinkEmail } from "@workspace/email";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { consts, env } from "@/lib/consts";
import { db } from "@/server/db";
import { serverConsts, serverEnv } from "@/server/serverConsts";

if (!serverConsts.email.sender) {
	throw new Error("Email sender not configured");
}
if (!serverEnv.RESEND_API_KEY) {
	throw new Error("RESEND_API_KEY not configured");
}

const emailSender = createEmailSender({
	apiKey: serverEnv.RESEND_API_KEY,
	from: serverConsts.email.sender,
});

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
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
				});
			},
		}),
	],
	secret: serverEnv.BETTER_AUTH_SECRET,
	baseURL: serverEnv.BETTER_AUTH_URL ?? env.NEXT_PUBLIC_URL,
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
