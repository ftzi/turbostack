import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// Reference: https://www.better-auth.com/docs/integrations/next#middleware
export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Check for session cookie
	const sessionCookie = request.cookies.get("better-auth.session_token")
	const hasSession = Boolean(sessionCookie?.value)

	// Redirect authenticated users away from auth page
	if (hasSession && pathname === "/auth") {
		return NextResponse.redirect(new URL("/dashboard", request.url))
	}

	// Redirect unauthenticated users to auth page for protected routes
	const protectedRoutes = ["/dashboard", "/tasks", "/calendar", "/goals", "/settings", "/admin"]
	const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

	if (!hasSession && isProtectedRoute) {
		return NextResponse.redirect(new URL("/auth", request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public files (public folder)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)",
	],
}
