import { inferAdditionalFields, magicLinkClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import type { auth } from "@/server/auth"

export const authClient = createAuthClient({
	plugins: [
		magicLinkClient(),
		// Reference: https://www.better-auth.com/docs/concepts/typescript#inferring-additional-fields-on-client
		inferAdditionalFields<typeof auth>(),
	],
})

export type { Session, User } from "@/server/auth"
