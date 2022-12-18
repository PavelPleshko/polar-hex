module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
	},
	env: {
		browser: true,
		node: true,
	},
	extends: ['eslint:recommended'],
	plugins: ['jsdoc', 'eslint-plugin-import'],
	overrides: [
		{
			files: ['**/*.{ts,tsx}'],
			parser: '@typescript-eslint/parser',
			parserOptions: {
				ecmaVersion: 6,
				project: ['tsconfig.json'],
				createDefaultProgram: true,
			},
			extends: ['plugin:@typescript-eslint/recommended'],
			rules: {
				'@typescript-eslint/explicit-member-accessibility': 'off',
				'@typescript-eslint/no-unused-vars': [
					'warn',
					{
						argsIgnorePattern: '^_',
						ignoreRestSiblings: true,
					},
				],
				'@typescript-eslint/member-ordering': [
					'error',
					{
						default: [
							'private-static-field',
							'protected-static-field',
							'public-static-field',
							'private-static-method',
							'protected-static-method',
							'public-static-method',
							'private-instance-field',
							'protected-instance-field',
							'public-instance-field',
							'private-constructor',
							'protected-constructor',
							'public-constructor',
							'public-instance-method',
							'protected-instance-method',
							'private-instance-method',
						],
					},
				],
				'@typescript-eslint/no-inferrable-types': 'warn',
				'@typescript-eslint/no-non-null-assertion': 'warn',
				'jsdoc/no-types': 'warn',
				'no-use-before-define': 'off',
				'@typescript-eslint/typedef': 'warn',
				'@typescript-eslint/explicit-function-return-type': [
					'error',
					{
						allowExpressions: true,
					},
				],
				'@typescript-eslint/ban-ts-comment': [
					'error',
					{
						'allow-with-description': true,
					},
				],
				'@typescript-eslint/explicit-module-boundary-types': 'warn',
				'@typescript-eslint/no-use-before-define': 'warn',
				'@typescript-eslint/no-var-requires': 'error',

				//// inherited rules replacements

				camelcase: 'off',
				// The `@typescript-eslint/naming-convention` rule allows `leadingUnderscore` and `trailingUnderscore` settings. However, the existing `no-underscore-dangle` rule already takes care of this.
				'@typescript-eslint/naming-convention': [
					'error',
					// Allow camelCase variables, PascalCase variables, and UPPER_CASE variables
					{
						selector: 'variable',
						format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
					},
					// Allow camelCase functions
					{
						selector: 'function',
						format: ['camelCase'],
					},
					// Sbg recommends PascalCase for classes, and although Sbg does not make TypeScript recommendations, we are assuming this rule would similarly apply to anything "type like", including interfaces, type aliases, and enums
					{
						selector: 'typeLike',
						format: ['PascalCase'],
					},
				],

				'default-param-last': 'off',
				'@typescript-eslint/default-param-last': 'error',

				'dot-notation': 'off',
				'@typescript-eslint/dot-notation': 'error',

				'no-array-constructor': 'off',
				'@typescript-eslint/no-array-constructor': 'error',

				'no-dupe-class-members': 'off',
				'@typescript-eslint/no-dupe-class-members': 'error',

				'no-empty-function': 'off',
				'@typescript-eslint/no-empty-function': 'error',

				'no-useless-constructor': 'off',
				'@typescript-eslint/no-useless-constructor': 'error',

				'no-shadow': 'off',
				'@typescript-eslint/no-shadow': 'error',

				//// turn off formatting rules
				'@typescript-eslint/no-extra-semi': 'off',
			},
		},
		{
			files: ['**/*.html'],
			plugins: ['html'],
			rules: {},
		},
	],
	rules: {
		'no-empty': 'error',

		'no-console': ['warn', { allow: ['warn', 'error'] }],

		// disallow fallthrough of case statements
		'no-fallthrough': 'error',

		'no-use-before-define': 'warn',

		// imports
		'import/order': ['error', { groups: [['builtin', 'external', 'internal']] }],

		// Forbid cyclical dependencies between modules
		'import/no-cycle': ['error', { maxDepth: '∞' }],

		camelcase: 'warn',

		'consistent-return': 'error',

		// specify the maximum cyclomatic complexity allowed in a program
		complexity: ['off', 20],

		// treat var statements as if they were block scoped
		'block-scoped-var': 'error',

		// enforces return statements in callbacks of array's methods
		'array-callback-return': 'error',

		// enforces getter/setter pairs in objects
		'accessor-pairs': 'off',

		'default-case-last': 'error',

		'default-param-last': 'error',

		'dot-notation': ['error', { allowKeywords: true }],

		// enforce only strict comparison operator ===
		eqeqeq: ['error', 'always', { null: 'ignore' }],

		// disallow non-grouped getter and setter for the same property
		'grouped-accessor-pairs': 'error',

		// disallows the use of arguments.caller or arguments.callee
		'no-caller': 'error',

		// disallows return statements in the constructor of a class
		'no-constructor-return': 'error',

		// disallows empty static blocks in classes
		'no-empty-static-block': 'error',

		// disallows comparing to 'null' via loose equals ==, != operators
		'no-eq-null': 'error',

		// disallow use of 'eval()'
		'no-eval': 'error',

		// disallow extend native types prototype: Boolean, String etc...
		'no-extend-native': 'error',

		// when using bind on function that function should use the 'this' keyword
		'no-extra-bind': 'error',

		// disallow labelling the loops that do not need it
		'no-extra-label': 'error',

		// disallow usage of unreadable version of decimals like .5, -.7
		'no-floating-decimal': 'error',

		// disallow var and named functions in global scope
		'no-implicit-globals': 'error',

		// disallow eval-like methods - setTimeout('<string code>'), setInterval, execScript
		'no-implied-eval': 'error',

		// disallow 'this' keyword where it is inferred to be 'undefined'
		'no-invalid-this': 'error',

		// disallow usage of __iterator__ property
		'no-iterator': 'error',

		// disallow use of labels for anything other than loops and switches
		'no-labels': ['error', { allowLoop: false, allowSwitch: false }],

		// disallow unnecessary nested blocks
		'no-lone-blocks': 'error',

		// disallow creation of functions within loops
		'no-loop-func': 'error',

		// disallow use of new operator when not part of the assignment or comparison
		'no-new': 'error',

		// disallow use of new operator for Function object
		'no-new-func': 'error',

		// disallows creating new instances of String, Number, and Boolean
		'no-new-wrappers': 'error',

		// disallow usage of __proto__ property
		'no-proto': 'error',

		// disallow use of assignment in return statement
		'no-return-assign': ['error', 'always'],

		// disallow redundant `return await`
		'no-return-await': 'error',

		// disallow use of `javascript:` urls.
		'no-script-url': 'error',

		// disallow comparisons where both sides are exactly the same
		'no-self-compare': 'error',

		// restrict what can be thrown as an exception
		'no-throw-literal': 'error',

		// disallow unmodified conditions of loops
		'no-unmodified-loop-condition': 'off',

		// disallow usage of expressions in statement position
		'no-unused-expressions': [
			'error',
			{
				allowShortCircuit: false,
				allowTernary: false,
				allowTaggedTemplates: false,
			},
		],

		// disallow useless string concatenation
		'no-useless-concat': 'error',

		// disallow redundant return; keywords
		'no-useless-return': 'error',

		// disallow use of void operator
		'no-void': 'error',

		// require using Error objects as Promise rejection reasons
		'prefer-promise-reject-errors': ['error', { allowEmptyReject: true }],

		// require use of the second argument for parseInt()
		radix: 'error',

		'require-await': 'off',

		// requires to declare all vars on top of their containing scope
		'vars-on-top': 'error',

		// require immediate function invocation to be wrapped in parentheses
		'wrap-iife': ['error', 'outside', { functionPrototypeMethods: false }],

		// require or disallow Yoda conditions
		yoda: 'error',

		// disallow to use this/super before super() calling in constructors.
		'no-this-before-super': 'error',

		// disallow useless computed property keys
		'no-useless-computed-key': 'error',

		// disallow unnecessary constructor
		'no-useless-constructor': 'error',
	},
};
