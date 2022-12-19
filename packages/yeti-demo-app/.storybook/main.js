const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
	core: { builder: 'webpack5' },
	stories: ['../src/**/*.stories.{js,ts,tsx,md,mdx}'],
	addons: [
		'storybook-prebuilt/addon-knobs/register.js',
		'storybook-prebuilt/addon-docs/register.js',
		'storybook-prebuilt/addon-viewport/register.js',
	],
	esDevServer: {
		// custom es-dev-server options
		nodeResolve: true,
		watch: true,
		open: true,
	},
	webpackFinal: async config => {
		// config.plugins.push(new RemoveAssetsPlugin({
		//     patterns: [
		//         // we need to remove excessive output from syntax highlighter package(more than 287 items) until its fixed.
		//         /^react-syntax-highlighter_languages_highlight_(?!typescript|htmlbars|scss).+\.bundle\.js(\.map)?$/,
		//     ],
		// }));

		config.resolve.plugins = [
			...(config.resolve.plugins || []),
			new TsconfigPathsPlugin({
				configFile: path.resolve(__dirname, '../tsconfig.json'),
			}),
		];

		// Return the altered config
		return config;
	},
};
