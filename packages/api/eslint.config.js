import { config } from "@workspace/eslint-config/base";

export default [
	...config,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		ignores: ["eslint.config.js", "dist", "drizzle.config.ts", "drizzle/**"],
	},
];
