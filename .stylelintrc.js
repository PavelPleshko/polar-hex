module.exports = {
	extends: [
		'stylelint-config-standard-scss',
		'stylelint-config-property-sort-order-smacss',
		'stylelint-config-prettier',
	],
	plugins: ['stylelint-scss', 'stylelint-order'],
	rules: {
		'block-no-empty': [true, { severity: 'error' }],
		'color-no-invalid-hex': [true, { severity: 'error' }],
		'declaration-block-no-duplicate-properties': [true, { severity: 'error' }],
		'declaration-block-no-duplicate-custom-properties': [true, { severity: 'error' }],
		'font-family-name-quotes': ['always-where-required', { severity: 'error' }],
		'font-family-no-duplicate-names': [true, { severity: 'error' }],
		'no-duplicate-selectors': [true, { severity: 'error' }],
		'no-duplicate-at-import-rules': [true, { severity: 'error' }],
		'selector-max-id': [1, { severity: 'error' }],
		'unit-no-unknown': [true, { severity: 'error' }],

		'scss/at-else-closing-brace-newline-after': ['always-last-in-chain', { severity: 'warning' }],
		'scss/at-if-closing-brace-newline-after': ['always-last-in-chain', { severity: 'warning' }],
		'scss/at-rule-no-unknown': [true, { severity: 'error' }],
		'scss/comment-no-empty': [true, { severity: 'warning' }],
		'scss/dollar-variable-colon-space-after': ['always', { severity: 'warning' }],
		'scss/selector-no-redundant-nesting-selector': [true, { severity: 'error' }],
		'no-empty-source': null,
	},
};
