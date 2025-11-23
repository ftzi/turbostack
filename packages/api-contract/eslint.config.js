import { config as baseConfig } from "@workspace/eslint-config/base"

export default [
	{
		ignores: ["**/*.d.ts", "eslint.config.js"],
	},
	...baseConfig,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
]
