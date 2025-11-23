/** @type {import('next').NextConfig} */
const nextConfig = {
	reactCompiler: true,
	transpilePackages: ["@workspace/ui"],
	turbopack: {
		rules: {
			"*.svg": {
				loaders: [
					{
						loader: "@svgr/webpack",
						options: {
							icon: true,
							// https://github.com/svg/svgo#configuration
							svgoConfig: {
								plugins: [
									// This is the default plugin used in https://react-svgr.com/playground.
									// It more importantly removes possible namespaces (e.g. xmlns:xyz) from the SVG, which would make React throw.
									{
										name: "preset-default",
										params: {
											overrides: {
												removeTitle: false,
											},
										},
									},
									// Remove dimensions from the SVG and generate a viewBox if missing. Allows us to properly size the image.
									{
										name: "removeDimensions",
										active: true,
									},
								],
							},
						},
					},
				],
				as: "*.js",
			},
		},
	},
}

export default nextConfig
