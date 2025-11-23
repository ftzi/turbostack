import { config } from "@workspace/eslint-config/base";

export default [
	...config,
	{
		languageOptions: {
			parserOptions: {
				project: "./tsconfig.json",
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		ignores: ["eslint.config.js"],
	},
];
