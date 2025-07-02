// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

import pluginJs from '@eslint/js';
import biome from 'eslint-config-biome';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import rscPlugin from './eslint/use-client.js';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		settings: { react: { version: 'detect' } },
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	reactHooks.configs['recommended-latest'],
	rscPlugin.configs.recommended,
	biome,
	{
		rules: {
			// "react-server-components/use-client": "error",
			'react/react-in-jsx-scope': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
		},
	},
	...storybook.configs['flat/recommended'],
];
