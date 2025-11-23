import js from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"
import onlyWarn from "eslint-plugin-only-warn"
import turboPlugin from "eslint-plugin-turbo"
import tseslint from "typescript-eslint"

/**
 * A shared ESLint configuration for the repository.
 * Uses strict type-checked configs for maximum type safety.
 *
 * Note: Packages must provide languageOptions.parserOptions.project
 * in their local eslint.config.js for type-checked rules to work.
 *
 * Note: eslint-config-prettier disables formatting rules so Biome handles formatting.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = [
	js.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	eslintConfigPrettier,
	{
		plugins: {
			turbo: turboPlugin,
		},
		rules: {
			"turbo/no-undeclared-env-vars": "warn",
			"@typescript-eslint/consistent-type-definitions": ["error", "type"],
		},
	},
	{
		plugins: {
			onlyWarn,
		},
	},
	{
		ignores: ["dist/**"],
	},
]
