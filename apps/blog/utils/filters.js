const { DateTime } = require('luxon');
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
};
