const resolve = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const minifyHTML = require('rollup-plugin-minify-html-literals');

const OUTPUT_PATH = '../../dist/apps/blog';

const terserOptions = {
	warnings: true,
	ecma: 2020,
	compress: {
		unsafe: true,
		passes: 2,
	},
	output: {
		comments: 'some',
		inline_script: false,
	},
	mangle: {
		properties: false,
	},
};

module.exports = [
	// SSR
	{
		input: [`${OUTPUT_PATH}/src/components/ssr.js`],
		output: {
			dir: `${OUTPUT_PATH}/rollupout/server`,
			format: 'esm',
		},
		plugins: [
			resolve(),
			minifyHTML,
			terser(terserOptions),
			// summary({
			//     // Already minified.
			//     showMinifiedSize: false,
			// }),
		],
	},
];
