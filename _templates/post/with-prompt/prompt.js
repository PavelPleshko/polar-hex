module.exports = [
	{
		type: 'input',
		name: 'title',
		message: 'Post title',
		validate: value => (!value ? 'Title cannot be empty' : true),
	},
	{
		type: 'input',
		name: 'description',
		message: 'Post description (will be shown as preview)',
		validate: value => {
			if (!value) {
				console.log('No description. Do not forget to update it!');
			}
			return true;
		},
	},
	{
		type: 'input',
		name: 'imageUrl',
		message: 'Feature image for the post',
	},
	{
		type: 'list',
		name: 'tags',
		message: 'Enter tags, separated by commas',
	},
];
