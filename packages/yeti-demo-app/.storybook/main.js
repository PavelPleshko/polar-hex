const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
	core: {
		builder: 'webpack5',
	},
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

		const tsConfigPath = path.resolve(__dirname, '../tsconfig.json');
		config.module.rules.push(
			{
				test: /\.ts$/,
				sideEffects: true,
				use: [
					{
						loader: 'ts-loader',
						options: {
							configFile: tsConfigPath,
						},
					},
				],
			},
			{
				test: /\.(scss|css)$/,
				use: [
					{
						loader: 'lit-scss-loader',
						options: {
							// defaultSkip: true,
							minify: true,
						},
					},
					'extract-loader',
					'css-loader',
					'sass-loader',
				],
			},
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
				include: path.resolve(__dirname, '../styles.scss'),
			}
		);
		config.resolve.plugins = [
			...(config.resolve.plugins || []),
			new TsconfigPathsPlugin({
				configFile: tsConfigPath,
			}),
		];

		// Return the altered config
		return config;
	},
};
