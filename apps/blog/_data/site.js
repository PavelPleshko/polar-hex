const DEFAULT_BASE_URL = 'http://localhost:8081';

const resolvedBase = process.env.PAGES_BASE_URL || DEFAULT_BASE_URL;

module.exports = {
	baseUrl: resolvedBase,
};
