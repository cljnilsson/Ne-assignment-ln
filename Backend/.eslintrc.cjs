module.exports = {
	root: true,
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"prettier"
	],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	parserOptions: {
		sourceType: "module",
		ecmaVersion: 2020
	},
	rules: {
		indent: ["error", "tab", { SwitchCase: 1, "ignoredNodes": ["PropertyDefinition"] }],
		"comma-dangle": ["error", "never"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
		"prefer-const": ["error"],
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-inferrable-types": "off"
	},
	env: {
		browser: false,
		es2017: true,
		node: true
	}
};
