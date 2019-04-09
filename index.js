const prompts = require(`prompts`);
const util = require(`util`);
const exec = util.promisify(require(`child_process`).exec);
const fs = require(`fs-extra`);
const validate = require(`validate-npm-package-name`);

// get all default dependencies
const deps = require(`./libs/deps`);

// get the .prettierrc template
const prettiers = require(`./libs/prettiers`);

// get the .eslintrc template
const eslints = require(`./libs/eslints`);

// mode enum
const modes = Object.freeze({
	browser: `browser`,
	node: `node`,
	hybrid: `hybrid`,
});

const questions = [
	{
		type: `text`,
		name: `name`,
		message: `What is the project name?`,
		validate: (value) => {
			const validated = validate(value);
			if (validated.warnings === undefined) validated.warnings = [];
			if (validated.errors === undefined) validated.errors = [];

			const warnings = validated.warnings.map(
				(warning) => `WARNING: ${warning}`
			);
			const errors = validated.errors.map((error) => `ERROR: ${error}`);

			if (!validated.validForNewPackages)
				return warnings.concat(errors).join(`\n`);
			return true;
		},
	},
	{
		type: `select`,
		name: `mode`,
		message: `What environment are you in?`,
		choices: [
			{ title: modes.browser, value: modes.browser },
			{ title: modes.node, value: modes.node },
			{ title: modes.hybrid, value: modes.hybrid },
		],
	},
	{
		type: (prev) => (prev === modes.node ? null : `toggle`),
		name: `react`,
		message: `Are you using React?`,
		initial: true,
		active: `yes`,
		inactive: `no`,
	},
];

// ========= MAIN =========
async function main() {
	const options = await prompts(questions);

	const packageFile = {
		name: options.name,
		version: `0.0.0`,
		main: `index.js`,
		license: `UNLICENSED`,
		private: true,
		scripts: {
			start: `node index.js`,
		},
	};

	// ========= PACKAGE.JSON =========
	// scripts to find airbnb package info
	const airbnbScripts = {
		react: `npm info eslint-config-airbnb@latest --json`,
		vanilla: `npm info eslint-config-airbnb-base@latest --json`,
	};

	// determine which script to use based on language and react
	const script = airbnbScripts[options.react ? `react` : `vanilla`];

	// get the airbnb packge info
	const { stdout, stderr, err } = await exec(script);
	if (err) return console.error(err);
	if (stderr) return console.error(stderr);
	const res = JSON.parse(stdout);

	// update package.json with dependencies
	packageFile.dependencies = {
		...packageFile.dependencies,
		...deps.dependencies,
	};
	packageFile.devDependencies = {
		...packageFile.devDependencies,
		...deps.devDependencies,
		...res.peerDependencies,
	};
	packageFile.devDependencies[res.name] = `^${res.version}`;

	// write the package.json
	const packageJSON = `./build/${options.name}/package.json`;
	fs.outputFile(packageJSON, JSON.stringify(packageFile, null, 2), (err) => {
		if (err) return console.error(err);
		console.log(`writing to ${packageJSON}`);
	});

	// ========= SUPPORTING FILES =========

	// eslintrc =========
	// generate the .eslintrc file
	const eslintFile = {
		env: (() => eslints.envs[options.mode])(),
		extends: (() =>
			options.react
				? eslints.extenders.react
				: eslints.extenders.vanilla)(),
		plugins: (() => eslints.plugins.common)(),
		rules: (() => eslints.rules.common)(),
	};

	// eslintrc
	const eslintRC = `./build/${options.name}/.eslintrc`;
	fs.outputFile(eslintRC, JSON.stringify(eslintFile, null, 2), (err) => {
		if (err) return console.error(err);
		console.log(`writing to ${eslintRC}`);
	});

	// prettierrc =========
	// generate the .prettierrc file
	const prettierFile = { ...prettiers };

	// prettierrc
	const prettierRC = `./build/${options.name}/.prettierrc`;
	fs.outputFile(prettierRC, JSON.stringify(prettierFile, null, 2), (err) => {
		if (err) return console.error(err);
		console.log(`writing to ${prettierRC}`);
	});
}

// ========= RUN =========
main();
