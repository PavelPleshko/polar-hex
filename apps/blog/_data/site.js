const DEFAULT_BASE_URL = 'https://polar-hex.github.io';

const resolvedBase = process.env.BLOG_BASE_URL || DEFAULT_BASE_URL;

module.exports = {
	baseUrl: resolvedBase,
};
