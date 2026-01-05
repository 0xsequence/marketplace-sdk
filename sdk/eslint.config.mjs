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
	{ ignores: ['.storybook/**'] },
	{ files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		settings: { react: { version: 'detect' } },
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
	reactHooks.configs.flat.recommended,
	rscPlugin.configs.recommended,
	biome,
	{
		rules: {
			// "react-server-components/use-client": "error",
			'react/react-in-jsx-scope': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
			// Disable React Compiler rules (we're not using the compiler yet)
			'react-hooks/static-components': 'off',
			'react-hooks/use-memo': 'off',
			'react-hooks/void-use-memo': 'off',
			'react-hooks/component-hook-factories': 'off',
			'react-hooks/preserve-manual-memoization': 'off',
			'react-hooks/incompatible-library': 'off',
			'react-hooks/immutability': 'off',
			'react-hooks/globals': 'off',
			'react-hooks/refs': 'off',
			'react-hooks/set-state-in-effect': 'off',
			'react-hooks/error-boundaries': 'off',
			'react-hooks/purity': 'off',
			'react-hooks/set-state-in-render': 'off',
			'react-hooks/unsupported-syntax': 'off',
			'react-hooks/config': 'off',
			'react-hooks/gating': 'off',
		},
	},
	...storybook.configs['flat/recommended'],
];
