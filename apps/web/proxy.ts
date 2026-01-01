import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:8081"

// Redirect all app routes to mobile app
export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl

	// App routes - redirect to mobile app subdomain
	const appRoutes = [
		"/dashboard",
		"/tasks",
		"/calendar",
		"/goals",
		"/settings",
		"/admin",
		"/auth",
		"/health",
		"/sleep",
		"/physical",
		"/nutrition",
		"/mind",
		"/mindset",
		"/self-esteem",
		"/personal-care",
		"/social",
		"/pets",
		"/groceries",
		"/purchases",
	]

	const isAppRoute = appRoutes.some((route) => pathname.startsWith(route))

	if (isAppRoute) {
		return NextResponse.redirect(new URL(pathname, APP_URL))
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
