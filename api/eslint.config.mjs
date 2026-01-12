import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ ignores: ['**/*.gen.ts', 'dist/**'] },
	{ files: ['**/*.ts'] },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,

	{
		rules: {
			'@typescript-eslint/no-unused-vars': 'off',
		},
	},

	{
		files: ['src/adapters/**/*.ts', 'src/types/**/*.ts'],
		ignores: ['**/*.gen.ts'],
		rules: {
			'@typescript-eslint/no-explicit-any': 'error',
			'no-restricted-syntax': [
				'error',
				{
					selector: 'TSInterfaceDeclaration',
					message:
						'Don\'t declare interfaces. Use `type X = Omit<GenType, "field"> & {...}` to derive from generated types.',
				},
				{
					selector: 'TSTypeAliasDeclaration > TSTypeLiteral',
					message:
						"Don't declare standalone object types. Derive from generated types using Omit/Pick/&.",
				},
				{
					selector: 'TSAnyKeyword',
					message:
						"Don't use `any`. Use `unknown` or proper types from generated files.",
				},
			],
		},
	},

	{
		files: ['src/types/primitives.ts'],
		rules: {
			'no-restricted-syntax': 'off',
		},
	},

	{
		files: [
			'src/__mocks__/**/*.ts',
			'src/adapters/builder/types.ts',
			'src/adapters/indexer/transforms.ts',
			'src/adapters/marketplace/client.ts',
		],
		rules: {
			'no-restricted-syntax': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},
];
