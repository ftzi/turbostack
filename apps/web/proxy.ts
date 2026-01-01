import { getSessionCookie } from "better-auth/cookies"
import { type NextRequest, NextResponse } from "next/server"

export default function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request)

	// Define protected routes - all dashboard routes
	const protectedRoutes = [
		"/dashboard",
		"/tasks",
		"/calendar",
		"/goals",
		"/physical",
		"/nutrition",
		"/health",
		"/sleep",
		"/mind",
		"/personal-care",
		"/social",
		"/mindset",
		"/self-esteem",
		"/pets",
		"/groceries",
		"/purchases",
		"/settings",
	]
	const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

	// Only redirect unauthenticated users from protected routes
	if (isProtectedRoute && !sessionCookie) {
		const authUrl = new URL("/auth", request.url)
		authUrl.searchParams.set("redirect", request.nextUrl.pathname)
		return NextResponse.redirect(authUrl)
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
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
}
