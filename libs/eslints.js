// ========= ENV =========
const envs = (() => {
	const base = { es6: true };

	// browser js
	const browser = {
		browser: true,
		...base,
	};

	// node js
	const node = {
		node: true,
		...base,
	};

	// hybrid browser/node
	const hybrid = {
		"shared-node-browser": true,
		...base,
		...browser,
		...node,
	};

	return {
		browser,
		node,
		hybrid,
	};
})();

// ========= EXTENDS =========
const extenders = (() => {
	const base = [
		`plugin:unicorn/recommended`,
		`plugin:prettier/recommended`,
	];

	// react js
	const react = [`airbnb`, ...base, `prettier/react`];

	// vanilla js
	const vanilla = [`airbnb-base`, ...base];

	return { react, vanilla };
})();

// ========= PLUGINS =========
const plugins = (() => {
	const base = [`unicorn`];

	// all
	const common = [...base];

	return { common };
})();

// ========= RULES =========
const rules = (() => {
	const base = {
		"class-methods-use-this": `off`,
		"consistent-return": `off`,
		"import/first": `off`,
		"import/newline-after-import": `off`,
		"import/no-dynamic-require": `off`,
		"import/order": `off`,
		"no-bitwise": `off`,
		"no-console": `off`,
		"no-plusplus": `off`,
		"no-restricted-globals": `off`,
		"no-shadow": [
			`error`,
			{
				allow: [`resolve`, `reject`, `err`, `error`, `cb`],
			},
		],
		"no-underscore-dangle": `off`,
		"no-use-before-define": `off`,
		"prefer-const": `error`,
		"prefer-template": `error`,
		quotes: [`error`, `backtick`],
		radix: `off`,
		"unicorn/filename-case": `off`,
		"unicorn/number-literal-case": `off`,
	};

	const common = { ...base };

	return { common };
})();

// ========= EXPORT =========
module.exports = { envs, extenders, plugins, rules };
