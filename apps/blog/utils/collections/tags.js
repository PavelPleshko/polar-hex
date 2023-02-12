const slugify = require('../generic/slugify');

module.exports = {
	generateUniqueTags: (allEntities, key = 'contentTags') => {
		const tagSet = new Set();
		allEntities.forEach(item => {
			if (key in item.data) {
				const tags = item.data[key].filter(item => {
					switch (item) {
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
		return [...tagSet].map(tag => {
			return {
				title: tag,
				slug: slugify(tag),
			};
		});
	},
};
