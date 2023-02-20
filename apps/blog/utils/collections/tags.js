const slugify = require('../generic/slugify');

module.exports = {
	generateUniqueTags: (allEntities, key = 'contentTags') => {
		const entitiesWithTags = allEntities.filter(item => key in item.data);
		// get all used categories
		const collectionTags = entitiesWithTags
			.flatMap(item => item.data[key])
			.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

		// dedupe
		const uniqueTags = [...new Set(collectionTags)];

		// format and return array of categories objects
		return uniqueTags.map(tag => {
			const entriesForTag = entitiesWithTags.filter(item => item.data[key].includes(tag));
			return {
				title: tag,
				slug: slugify(tag),
				totalItems: entriesForTag.length,
			};
		});
	},
};
