module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true
	},
	plugins: ['prettier'],
	extends: ['eslint:recommended', 'plugin:prettier/recommended'],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly'
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module'
	},
	rules: {
		'prettier/prettier': 'error',
		'brace-style': [1, '1tbs'],
		indent: [0, 'tab'],
		'linebreak-style': [0, 'windows'],
		quotes: [2, 'single'],
		semi: [0, 'never'],
		'no-unused-vars': 2,
		'no-var': 2,
		'no-const-assign': 2,
		'prefer-const': 2,
		'newline-after-var': 2,
		'spaced-comment': 1,
		'space-infix-ops': 2,
		'no-multi-spaces': 1,
		'no-multiple-empty-lines': [1, { max: 1 }],
		'no-spaced-func': 2,
		'no-trailing-spaces': 1,
		'array-bracket-spacing': [2, 'never'],
		'comma-dangle': [2, 'never'],
		eqeqeq: 2,
		'key-spacing': [2, { beforeColon: false, afterColon: true }]
	}
};
