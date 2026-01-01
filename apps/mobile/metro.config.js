// Reference: https://www.better-auth.com/docs/integrations/expo#configure-metro-bundler
const { getDefaultConfig } = require("expo/metro-config")
const { withUniwindConfig } = require("uniwind/metro")

const config = getDefaultConfig(__dirname)

// Enable package exports for Better Auth
config.resolver.unstable_enablePackageExports = true

module.exports = withUniwindConfig(config, {
	cssEntryFile: "./global.css",
	dtsFile: "./uniwind-types.d.ts",
	polyfills: {
		rem: 16,
	},
})
