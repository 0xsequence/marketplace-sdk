import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ ignores: ['**/*.gen.ts', 'dist/**'] },
	{ files: ['**/*.ts'] },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,

	// ============================================================
	// GLOBAL RULES
	// ============================================================
	{
		rules: {
			// Disable unused-vars (too noisy, biome handles this)
			'@typescript-eslint/no-unused-vars': 'off',
		},
	},

	// ============================================================
	// API PACKAGE: Must derive from generated types
	// ============================================================
	{
		files: ['src/adapters/**/*.ts', 'src/types/**/*.ts'],
		ignores: ['**/*.gen.ts'],
		rules: {
			// Ban explicit any
			'@typescript-eslint/no-explicit-any': 'error',

			'no-restricted-syntax': [
				'error',
				// Ban interface declarations - must use type derivation
				{
					selector: 'TSInterfaceDeclaration',
					message:
						"Don't declare interfaces. Use `type X = Omit<GenType, \"field\"> & {...}` to derive from generated types.",
				},
				// Ban standalone object types - must derive
				{
					selector: 'TSTypeAliasDeclaration > TSTypeLiteral',
					message:
						"Don't declare standalone object types. Derive from generated types using Omit/Pick/&.",
				},
				// Ban any
				{
					selector: 'TSAnyKeyword',
					message:
						"Don't use `any`. Use `unknown` or proper types from generated files.",
				},
			],
		},
	},

	// ============================================================
	// PRIMITIVES: Allowed to declare new types (foundational)
	// ============================================================
	{
		files: ['src/types/primitives.ts'],
		rules: {
			'no-restricted-syntax': 'off',
		},
	},

	// ============================================================
	// TEMPORARY IGNORES - files still need refactoring
	// ============================================================
	{
		files: [
			'src/__mocks__/**/*.ts',
			// TODO: Convert interfaces to type derivations
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
