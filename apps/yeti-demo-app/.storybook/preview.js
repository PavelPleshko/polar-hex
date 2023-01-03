import '!style-loader!css-loader!sass-loader!../src/styles.scss';

export const parameters = {
	actions: {
		argTypesRegex: '^on[A-Z].*',
	},
	docs: {
		inlineStories: false,
		iframeHeight: 'auto',
	},
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
};
