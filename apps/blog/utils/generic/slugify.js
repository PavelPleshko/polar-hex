/**
 * Transform a string into a slug
 * Uses slugify package
 *
 * @param {String} str - string to slugify
 */
module.exports = str => {
	return str.split(' ').join('-');
};
