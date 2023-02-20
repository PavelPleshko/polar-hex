const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');

const CODE_MARKER_LEADING = '<code>';
const CODE_MARKER_TRAILING = '</code>';

/**
 *
 * @param {MarkdownIt} md markdown-it
 * @param {string} str code
 * @param {string} lang code language
 * @returns
 */
const highlighter = function (md, str, lang) {
	let result = '';
	if (lang) {
		try {
			loadLanguages([lang]);
			result = Prism.highlight(str, Prism.languages[lang], lang);
		} catch (err) {
			console.log(err);
		}
	} else {
		result = md.utils.escapeHtml(str);
	}

	return `<pre>${CODE_MARKER_LEADING}${result}${CODE_MARKER_TRAILING}</pre>`;
};

const preWrapperPlugin = md => {
	const fence = md.renderer.rules.fence;
	md.renderer.rules.fence = (...args) => {
		const [tokens, idx] = args;
		const lang = tokens[idx].info.trim();
		const rawCode = fence(...args);
		return `<div class="language-${lang}">${rawCode}</div>`;
	};
};

const lineNumberPlugin = md => {
	const fence = md.renderer.rules.fence;
	md.renderer.rules.fence = (...args) => {
		const [tokens, idx] = args;
		const lang = tokens[idx].info.trim();
		const rawCode = fence(...args);
		const code = rawCode.slice(rawCode.indexOf(CODE_MARKER_LEADING), rawCode.indexOf(CODE_MARKER_TRAILING));

		const lines = code.split('\n');
		const lineNumbersHtml = [...Array(lines.length - 1)]
			.map((line, index) => `<span class="line-number">${index + 1}</span><br>`)
			.join('');

		const wrappedLineNumbersHtml = `<div class="line-numbers-wrapper" aria-hidden="true">${lineNumbersHtml}</div>`;

		return rawCode
			.replace(/<\/div>$/, `${wrappedLineNumbersHtml}</div>`)
			.replace(/"(language-\S*?)"/, '"$1 line-numbers-mode"')
			.replace(/<code>/, `<code class="language-${lang}">`)
			.replace(/<pre>/, `<pre class="language-${lang}">`);
	};
};

module.exports = {
	highlighter: highlighter,
	preWrapperPlugin: preWrapperPlugin,
	lineNumberPlugin: lineNumberPlugin,
};
