module.exports = {
	limit: (arr, count = 5) => {
		return (arr || []).slice(0, count);
	},
	json: value => {
		return JSON.stringify(value, null, 2);
	},
};
