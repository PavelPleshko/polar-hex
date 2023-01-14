const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginNavigation = require('@11ty/eleventy-navigation');
const markdownIt = require('markdown-it');
const markdownItEmoji = require('markdown-it-emoji');

const customFilters = require('./utils/filters.js');

module.exports = function (eleventyConfig) {
	/**
	 * Plugins
	 * @link https://www.11ty.dev/docs/plugins/
	 */

	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginNavigation);

	/**
	 * Filters
	 * @link https://www.11ty.io/docs/filters/
	 */
	Object.keys(customFilters).forEach(filterName => {
		eleventyConfig.addFilter(filterName, customFilters[filterName]);
	});

	/**
	 * Collections
	 * ============================
	 *
	 * POST Collection set so we can check status of "draft:" frontmatter.
	 * If set "true" then post will NOT be processed in PRODUCTION env.
	 * If "false" or NULL it will be published in PRODUCTION.
	 * Every Post will ALWAYS be published in DEVELOPMENT so you can preview locally.
	 */
	eleventyConfig.addCollection('post', collection => {
		if (process.env.ELEVENTY_ENV !== 'production') return [...collection.getFilteredByGlob('./src/posts/*.md')];
		else return [...collection.getFilteredByGlob('./src/posts/*.md')].filter(post => !post.data.draft);
	});

	eleventyConfig.addCollection('tagList', function (collection) {
		let tagSet = new Set();
		collection.getAll().forEach(function (item) {
			if ('tags' in item.data) {
				let tags = item.data.tags;

				tags = tags.filter(function (item) {
					switch (item) {
						// this list should match the `filter` list in tags.njk
						case 'authors':
						case 'pages':
						case 'post':
							return false;
					}

					return true;
				});

				for (const tag of tags) {
					tagSet.add(tag);
				}
			}
		});
		return [...tagSet];
	});

	eleventyConfig.addLayoutAlias('base', 'layouts/base.njk');
	eleventyConfig.addLayoutAlias('page', 'layouts/page.njk');
	// eleventyConfig.addLayoutAlias('post', 'layouts/post.njk')

	eleventyConfig.addWatchTarget('./src/assets');
	eleventyConfig.addWatchTarget('./tailwind.config.js');

	/**
	 * Set custom markdown library instance
	 * and support for Emojis in markdown.
	 */
	let options = {
		html: true,
		breaks: true,
		linkify: true,
		typographer: true,
	};
	let markdownLib = markdownIt(options).use(markdownItEmoji);
	eleventyConfig.setLibrary('md', markdownLib);

	return {
		// TODO maybe there is a NX executor for this
		dir: {
			input: 'src',
			output: '../../dist',
			includes: '_includes',
			data: '_data',
		},
		passthroughFileCopy: true,
		templateFormats: ['html', 'njk', 'md'],
		htmlTemplateEngine: 'njk',
		markdownTemplateEngine: 'njk',
	};
};
