import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { consts, env } from "@/lib/consts";
import { DEFAULT_METADATA, DEFAULT_OPENGRAPH } from "@/lib/opengraph/defaults";

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

export const metadata: Metadata = {
	title: {
		default: consts.appName,
		template: `%s | ${consts.appName}`,
	},
	description: DEFAULT_METADATA.description,
	applicationName: consts.appName,
	metadataBase: env.NEXT_PUBLIC_URL ? new URL(env.NEXT_PUBLIC_URL) : undefined,
	keywords: [],
	openGraph: {
		...DEFAULT_OPENGRAPH,
		...(consts.email.contact && { emails: [consts.email.contact] }),
	},
	icons: {
		icon: [
			{
				url: "/api/icon?theme=light",
				media: "(prefers-color-scheme: light)",
			},
			{
				url: "/api/icon?theme=dark",
				media: "(prefers-color-scheme: dark)",
			},
		],
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}): React.ReactElement {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
