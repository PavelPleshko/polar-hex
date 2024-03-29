const { DateTime } = require('luxon');
const lodash = require('lodash');
const path = require('path');
const slugify = require('./generic/slugify');

const site = require('../site/_data/site');

module.exports = {
	limit: (arr, count = 5) => {
		return (arr || []).slice(0, count);
	},
	json: value => {
		return JSON.stringify(value, null, 2);
	},
	readingTime: text => {
		const READING_SPEED_WORDS_PER_MINUTE = 250;
		const words = text.trim().split(/\s+/).length;
		return Math.ceil(words / READING_SPEED_WORDS_PER_MINUTE);
	},
	readableDate: dateObj => {
		// turn it into a JS Date string
		const date = new Date(dateObj);

		// pass it to luxon for formatting
		return DateTime.fromJSDate(date).toFormat('dd MMM, yyyy');
	},
	truncate: (value, count = 0) => {
		const truncationDelimiter = '...';
		if (value.length + truncationDelimiter.length <= count || count === 0) {
			return value;
		}
		return `${value.substring(0, count)}${truncationDelimiter}`;
	},

	include: (arr, path, value) => {
		value = lodash.deburr(value).toLowerCase();
		return arr.filter(item => {
			let pathValue = lodash.get(item, path);
			pathValue = lodash.deburr(pathValue).toLowerCase();
			return pathValue.includes(value);
		});
	},

	slugify: slugify,

	pluckProperty: (arr, propertyName = '') => {
		return arr.map(item => item[propertyName]);
	},

	URIencode: str => {
		if (!str) {
			return '';
		}
		return encodeURI(str);
	},

	toAbsoluteUrl: url => {
		if (!url || url === '/') {
			return path.join(new URL(site.baseUrl).href, site.deployUrl);
		}
		return new URL(path.join(site.deployUrl, url), site.baseUrl).href;
	},
};
