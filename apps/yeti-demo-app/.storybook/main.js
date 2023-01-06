const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
	core: {
		builder: 'webpack5',
	},
	stories: ['../src/**/*.stories.{js,ts,tsx,md,mdx}'],
	addons: [
		'storybook-prebuilt/addon-knobs/register.js',
		'storybook-prebuilt/addon-viewport/register.js',
		{
			name: '@storybook/addon-docs',
			options: {
				configureJSX: true,
				babelOptions: {},
				sourceLoaderOptions: null,
				transcludeMarkdown: true,
			},
		},
	],
	esDevServer: {
		// custom es-dev-server options
		nodeResolve: true,
		watch: true,
		open: true,
	},
	webpackFinal: async config => {
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
