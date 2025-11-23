import { nextJsConfig } from "@workspace/eslint-config/next-js";

/** @type {import("eslint").Linter.Config} */
export default [
	{
		ignores: [
			".next/**",
			".turbo/**",
			"node_modules/**",
			"eslint.config.js",
			"next.config.ts",
			"next.config.mjs",
			"postcss.config.mjs",
		],
	},
	...nextJsConfig,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
];
