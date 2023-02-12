const lodash = require('lodash');

const fromEntries = contentEntries => {
	const allContentEntries = contentEntries.sort((prev, curr) => {
		return new Date(curr.data.date).getTime() - new Date(prev.data.date).getTime();
	});

	if (process.env.ELEVENTY_ENV !== 'production') {
		return allContentEntries;
	}
	return allContentEntries.filter(entry => !entry.data.draft);
};

const fromTags = (contentEntries, uniqueTags, itemsPerPage = 10) => {
	const paginatedCollectionByCategories = [];
	contentEntries = fromEntries(contentEntries);

	uniqueTags.forEach(tag => {
		const postsForTag = contentEntries.filter(item => item.data.contentTags?.includes(tag.title));

		// chunk posts in category to create pages
		const chunkedCollection = lodash.chunk(postsForTag, itemsPerPage);

		// create array of slugs
		const slugs = [];
		for (let i = 1; i <= chunkedCollection.length; i++) {
			let slug = `${tag.slug}/${i}`;
			if (i === 1) {
				slug = tag.slug;
			}

			slugs.push(slug);
		}

		// add formatted objects to empty array
		chunkedCollection.forEach((items, index) => {
			paginatedCollectionByCategories.push({
				title: tag.title,
				slug: slugs[index],
				currentPage: index + 1,
				totalItems: postsForTag.length,
				totalPages: Math.ceil(postsForTag.length / itemsPerPage),
				items: items,
				hrefs: {
					all: slugs,
					first: slugs[0],
					last: slugs[slugs.length - 1],
					next: slugs[index + 1] ?? null,
					previous: slugs[index - 1] ?? null,
				},
			});
		});
	});

	return paginatedCollectionByCategories;
};

module.exports = {
	fromEntries: fromEntries,
	fromTags: fromTags,
};
