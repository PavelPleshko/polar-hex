const padWithLeadingZero = num => {
	return `0${num}`.slice(-2);
};

const getYear = new Date().getFullYear();
const getMonth = new Date().getMonth() + 1;
const getDay = new Date().getDate();

module.exports = {
	helpers: {
		getDate: () => `${getYear}-${padWithLeadingZero(getMonth)}-${padWithLeadingZero(getDay)}`,
		getYear,
	},
};
