/** Whether email functionality is enabled in the app. */
export const emailEnabled = false as boolean

/** Consts used by the client and server. */
export const consts = {
	appName: "MyProject",
	description: "My Project Description",

	/** Whether email functionality is enabled. */
	emailEnabled,

	/** Whether the header should stick to the top of the viewport on scroll. */
	stickyHeader: true,

	/**
	 * Either 'light' or 'dark'. It depends on your app's design and your users' preferences.
	 *
	 * I don't recommend spending time and effort supporting both if you are not already making some good money with the app,
	 * as you would need to check every addition to the app to make sure it works on both themes.
	 */
	// defaultColorScheme: "dark",

	// socialMediaLinks: {
	//   youtube: "https://www.youtube.com/@",
	//   discord: "https://discord.com/invite/",
	//   instagram: "https://www.instagram.com/",
	//   x: "https://x.com/",
	// } satisfies Partial<Record<SocialMedia, string>>,

	email: {
		// biome-ignore lint/style/noNonNullAssertion: validated by createEnv
		contact: emailEnabled ? `contact@${process.env.NEXT_PUBLIC_EMAIL_DOMAIN!}` : undefined,
	},

	/** Where to redirect to after a successful authentication. */
	pathWhenLoggedIn: "/app",
} as const
