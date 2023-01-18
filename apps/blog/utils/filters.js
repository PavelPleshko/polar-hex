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
};
