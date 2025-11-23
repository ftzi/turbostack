import { config } from "@workspace/eslint-config/base.js";

/**
 * Root ESLint configuration
 * Only applies to root-level files, not workspaces
 */
export default [
	...config,
	{
		ignores: ["apps/**", "packages/**", "eslint.config.js"],
	},
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
];
