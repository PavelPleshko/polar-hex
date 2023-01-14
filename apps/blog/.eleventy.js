const fs = require('fs');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginNavigation = require('@11ty/eleventy-navigation');
const markdownIt = require('markdown-it');
const markdownItEmoji = require('markdown-it-emoji');

const customFilters = require('./utils/filters.js');

const OUTPUT_PATH = '../../dist/apps/blog';
const NOT_FOUND_PATH = `${OUTPUT_PATH}/404.html`;

module.exports = function (eleventyConfig) {
	eleventyConfig.setBrowserSyncConfig({
		callbacks: {
			ready: function (err, bs) {
				bs.addMiddleware('*', (req, res) => {
					if (!fs.existsSync(NOT_FOUND_PATH)) {
						throw new Error(
							`Expected a \`${NOT_FOUND_PATH}\` file but could not find one. Did you create a 404.html template?`
						);
					}

					const content_404 = fs.readFileSync(NOT_FOUND_PATH);
					// Add 404 http status code in request header.
					res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
					// Provides the 404 content without redirect.
					res.write(content_404);
					res.end();
				});
			},
		},
	});

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
			output: OUTPUT_PATH,
			includes: '_includes',
			data: '_data',
		},
		passthroughFileCopy: true,
		templateFormats: ['html', 'njk', 'md'],
		htmlTemplateEngine: 'njk',
		markdownTemplateEngine: 'njk',
	};
};
