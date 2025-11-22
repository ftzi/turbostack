import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { consts, env } from "@/lib/consts";

/**
 * https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
 *
 * Some good fonts that are available in the `next/font/google` package to be easily used:
 * Inter - https://fonts.google.com/specimen/Inter
 * Geist - https://fonts.google.com/specimen/Geist
 * Source_Sans_3 - https://fonts.google.com/specimen/Source+Sans+3
 * Roboto - https://fonts.google.com/specimen/Roboto
 * Poppins - https://fonts.google.com/specimen/Poppins
 * Lato - https://fonts.google.com/specimen/Lato
 * Noto - https://fonts.google.com/noto
 * Rubik - https://fonts.google.com/specimen/Rubik
 */

const fontSans = Geist({
	subsets: ["latin"],
	variable: "--font-sans",
});

const fontMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
});

/**
 * The `metadata` is very important for SEO and social media sharing.
 *
 * https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export const metadata: Metadata = {
	// This is the default title for all pages. You can override it in each page.
	// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#title
	title: {
		default: `${consts.appName}`, // You can add here a ` | The Project you need` (or `-` instead of `|`), that is shown in the tab title.
		template: `%s | ${consts.appName}`,
	},
	description: consts.description,
	applicationName: consts.appName,
	metadataBase: new URL(env.NEXT_PUBLIC_URL),
	// `keywords` is said to be ignored by Search Engine, but it doesn't hurt to add it.
	keywords: [],
	openGraph: {
		siteName: consts.appName, // some websites prefer `youtube.com` pattern, though. This is sometimes shown before title.
		title: consts.appName, // Shown above description
		description: consts.description,
		url: env.NEXT_PUBLIC_URL,
		emails: [consts.email.contact],
		type: "website",
		locale: "en_US",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>): React.ReactElement {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
