import type { auth } from "@workspace/api/auth"
import { inferAdditionalFields, magicLinkClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"

export const authClient = createAuthClient({
	baseURL: API_URL,
	plugins: [magicLinkClient(), inferAdditionalFields<typeof auth>()],
})

export type { Session, User } from "@workspace/api/auth"
