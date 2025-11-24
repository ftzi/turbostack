import { auth } from "@workspace/api/auth"
import { toNextJsHandler } from "better-auth/next-js"

/**
 * Better Auth API route handler for Next.js
 * Reference: https://www.better-auth.com/docs/integrations/next
 */
export const { GET, POST } = toNextJsHandler(auth)
