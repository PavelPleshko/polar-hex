const fs = require('fs');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginNavigation = require('@11ty/eleventy-navigation');
const markdownIt = require('markdown-it');
const markdownItEmoji = require('markdown-it-emoji');
const markdownItAnchor = require('markdown-it-anchor');
const pluginTOC = require('eleventy-plugin-toc');

const customFilters = require('./utils/filters.js');
const tagsCollection = require('./utils/collections/tags');
const writingCollection = require('./utils/collections/writing-entity');

const OUTPUT_PATH = '../../dist/apps/blog';
const NOT_FOUND_PATH = `${OUTPUT_PATH}/404.html`;

const MAX_ENTRIES_PER_PAGE = 9;

module.exports = function (eleventyConfig) {
	// https://github.com/JordanShurmer/eleventy-plugin-toc#readme
	eleventyConfig.addPlugin(pluginTOC, {
		tags: ['h2', 'h3', 'h4'],
		wrapper: 'div',
		ul: true,
		flat: false,
	});

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
	 * Set custom markdown library instance
	 * and support for Emojis in markdown.
	 */
	const markdownLib = markdownIt({
		html: true,
		breaks: true,
		linkify: true,
		typographer: true,
	})
		.use(markdownItAnchor)
		.use(markdownItEmoji);
	eleventyConfig.setLibrary('md', markdownLib);

	eleventyConfig.addFilter('md', value => {
		return markdownLib.render(value);
	});

	eleventyConfig.addNunjucksFilter('excludeFromCollection', function (collection = [], pageUrl = this.ctx.page.url) {
		return collection.filter(post => post.url !== pageUrl);
	});

	eleventyConfig.addFilter('filterByTags', function (collection = [], ...requiredTags) {
		return collection.filter(post => {
			return requiredTags.flat().every(tag => post.data.contentTags?.includes(tag));
		});
	});

	eleventyConfig.addNunjucksFilter('related', function (collection = []) {
		const { tags: requiredTags, page } = this.ctx;
		return collection.filter(post => {
			return post.url !== page.url && requiredTags?.every(tag => post.data.contentTags?.includes(tag));
		});
	});

	/**
	 * Collections
	 * ============================
	 *
	 * POST Collection set so we can check status of "draft:" front-matter.
	 * If set "true" then post will NOT be processed in PRODUCTION env.
	 * If "false" or NULL it will be published in PRODUCTION.
	 * Every Post will ALWAYS be published in DEVELOPMENT so you can preview locally.
	 */
	eleventyConfig.addCollection('posts', collection => {
		return writingCollection.fromEntries(collection.getFilteredByGlob('./site/posts/**/!(index)*.md'));
	});

	eleventyConfig.addCollection('tutorials', collection => {
		return writingCollection.fromEntries(collection.getFilteredByGlob('./site/tutorials/**/!(index)*.md'));
	});

	eleventyConfig.addCollection('tagList', collectionApi => tagsCollection.generateUniqueTags(collectionApi.getAll()));

	eleventyConfig.addGlobalData('paginationConfig', {
		maxEntries: MAX_ENTRIES_PER_PAGE,
	});
	eleventyConfig.addCollection('postsByTags', collectionApi => {
		const allEntities = collectionApi.getAll();
		const collectionTags = tagsCollection.generateUniqueTags(allEntities);
		return writingCollection.fromTags(allEntities, collectionTags, MAX_ENTRIES_PER_PAGE);
	});

	// rendering
	eleventyConfig.addShortcode('renderlayoutblock', function (name) {
		return (this.page.layoutblock || {})[name] || '';
	});

	eleventyConfig.addPairedShortcode('layoutblock', function (content, name) {
		if (!this.page.layoutblock) this.page.layoutblock = {};
		this.page.layoutblock[name] = content;
		return '';
	});

	eleventyConfig.addLayoutAlias('base', 'layouts/base.html');
	eleventyConfig.addLayoutAlias('page', 'layouts/page.html');
	eleventyConfig.addLayoutAlias('post', 'layouts/post.html');
	eleventyConfig.addLayoutAlias('contentPage', 'layouts/content-page.html');

	eleventyConfig.addWatchTarget('./site/assets');
	eleventyConfig.addWatchTarget('./tailwind.config.js');

	eleventyConfig.addPassthroughCopy('./site/assets/images/**/*');

	return {
		// TODO maybe there is a NX executor for this
		dir: {
			input: 'site',
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
