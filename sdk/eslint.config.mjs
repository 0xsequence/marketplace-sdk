// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

import pluginJs from '@eslint/js';
import biome from 'eslint-config-biome';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import rscPlugin from './eslint/use-client.js';
import sequenceTypesPlugin from './eslint/sequence-types.js';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		ignores: [
			'.storybook/**',
			'**/*.gen.ts',
			'dist/**',
			// Config files not in tsconfig - skip type-checked rules
			'*.config.js',
			'*.config.mjs',
			'compile-tailwind.js',
			'eslint/**',
			'public/**',
			'vitest.shims.d.ts',
		],
	},
	{ files: ['**/*.{ts,tsx}'] },
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		settings: { react: { version: 'detect' } },
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	pluginReact.configs.flat.recommended,
	reactHooks.configs.flat.recommended,
	rscPlugin.configs.recommended,
	biome,

	// ============================================================
	// SEQUENCE TYPE ENFORCEMENT PLUGIN
	// ============================================================
	{
		plugins: {
			'@sequence/types': sequenceTypesPlugin,
		},
		rules: {
			'@sequence/types/enforce-address-type': 'warn',
			'@sequence/types/enforce-token-id-type': 'warn',
			'@sequence/types/enforce-amount-type': 'warn',
			'@sequence/types/enforce-chain-id-type': 'warn',
			'@sequence/types/no-string-bigint-fields': 'warn',
			'@sequence/types/no-manual-query-params': 'warn',
			'@sequence/types/no-namespace-type-imports': 'warn',
		},
	},

	// ============================================================
	// GLOBAL RULES
	// ============================================================
	{
		rules: {
			'react/react-in-jsx-scope': 'off',
			'@typescript-eslint/no-unused-vars': 'off',

			// ============================================================
			// TYPE SAFETY RULES
			// ============================================================

			// Ban explicit `any` everywhere
			'@typescript-eslint/no-explicit-any': 'error',

			// Ban non-null assertions (!) - forces proper null handling
			'@typescript-eslint/no-non-null-assertion': 'error',

			// Unsafe operations on `any` values - warn for now, fix incrementally
			// Many of these come from external libraries with incomplete types
			'@typescript-eslint/no-unsafe-assignment': 'warn',
			'@typescript-eslint/no-unsafe-member-access': 'warn',
			'@typescript-eslint/no-unsafe-call': 'warn',
			'@typescript-eslint/no-unsafe-return': 'warn',
			'@typescript-eslint/no-unsafe-argument': 'warn',

			// Enum comparisons - warn for now, requires api-client type fixes
			'@typescript-eslint/no-unsafe-enum-comparison': 'warn',

			// Require consistent type assertions style
			// 'allow' permits object literals with 'as' - common for React Query options
			'@typescript-eslint/consistent-type-assertions': [
				'warn',
				{
					assertionStyle: 'as',
					objectLiteralTypeAssertions: 'allow',
				},
			],

			// Redundant type constituents - warn, many are intentional for readability
			'@typescript-eslint/no-redundant-type-constituents': 'warn',

			// require-await - warn, some functions need async for API consistency
			'@typescript-eslint/require-await': 'warn',

			// Ban deprecated namespace imports (MarketplaceAPI, BuilderAPI)
			// Use direct type imports instead: import type { Order } from '@0xsequence/api-client'
			'no-restricted-imports': [
				'error',
				{
					paths: [
						{
							name: '@0xsequence/api-client',
							importNames: ['MarketplaceAPI', 'BuilderAPI'],
							message:
								'Deprecated: Use direct type imports instead of namespace imports. Example: import type { Order } from "@0xsequence/api-client"',
						},
						{
							name: 'viem',
							importNames: ['Address', 'Hash'],
							message:
								'Import Address/Hash from @0xsequence/api-client instead of viem directly. This ensures consistent type usage across the SDK.',
						},
					],
				},
			],

			// ============================================================
			// TYPE CONSISTENCY: Ban raw hex string patterns
			// ============================================================
			'no-restricted-syntax': [
				'warn',
				// Ban `0x${string}` template literal - use Address type instead
				{
					selector: 'TSTemplateLiteralType',
					message:
						'Don\'t use `0x${string}` directly. Import and use `Address` from @0xsequence/api-client instead.',
				},
				// Ban literal zero address - use zeroAddress from viem instead
				{
					selector:
						'Literal[value="0x0000000000000000000000000000000000000000"]',
					message:
						'Don\'t use literal zero address. Import and use `zeroAddress` from viem instead.',
				},
			],

			// Ban @ts-ignore (use @ts-expect-error with description instead)
			'@typescript-eslint/ban-ts-comment': [
				'error',
				{
					'ts-expect-error': 'allow-with-description',
					'ts-ignore': true,
					'ts-nocheck': true,
				},
			],

			// ============================================================
			// REACT COMPILER RULES (disabled - not using yet)
			// ============================================================
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

	// ============================================================
	// ANALYTICS/TRACKING FILES: String serialization is intentional
	// ============================================================
	{
		files: ['src/**/*databeat*/**', 'src/**/*analytics*/**', 'src/**/*tracking*/**'],
		rules: {
			'@sequence/types/enforce-address-type': 'off',
			'@sequence/types/enforce-token-id-type': 'off',
			'@sequence/types/enforce-amount-type': 'off',
			'@sequence/types/enforce-chain-id-type': 'off',
			'@sequence/types/no-string-bigint-fields': 'off',
		},
	},

	// ============================================================
	// URL STATE FILES: URL params are strings by design
	// ============================================================
	{
		files: ['src/**/*url-state*/**', 'src/**/*url*state*/**'],
		rules: {
			'@sequence/types/enforce-address-type': 'off',
			'@sequence/types/enforce-amount-type': 'off',
		},
	},

	// ============================================================
	// UI COMPONENTS: Display values (balance, quantity) are strings
	// ============================================================
	{
		files: [
			'src/**/ui/components/**/*.{ts,tsx}',
			'src/**/ui/modals/**/store.ts',
			'src/**/ui/modals/**/context.ts',
		],
		rules: {
			'@sequence/types/enforce-amount-type': 'off',
		},
	},

	// ============================================================
	// MODAL HOOKS & CHECKOUT: Props from external sources are strings
	// ============================================================
	{
		files: [
			'src/**/ui/modals/**/hooks/*.ts',
			'src/**/ui/modals/**/components/**/*.ts',
		],
		rules: {
			'@sequence/types/enforce-address-type': 'off',
			'@sequence/types/enforce-token-id-type': 'off',
			'@sequence/types/enforce-amount-type': 'off',
		},
	},

	// ============================================================
	// EXTERNAL TYPES: Copied from external packages, can't change
	// ============================================================
	{
		files: ['src/types/waas-types.ts'],
		rules: {
			'@sequence/types/enforce-address-type': 'off',
			'@sequence/types/enforce-token-id-type': 'off',
			'@sequence/types/enforce-amount-type': 'off',
		},
	},

	// ============================================================
	// DISPLAY UTILITIES: Work with any string for formatting
	// ============================================================
	{
		files: ['src/utils/address.ts'],
		rules: {
			'@sequence/types/enforce-address-type': 'off',
		},
	},

	// ============================================================
	// WAAS/FEE HOOKS: External API types are strings
	// ============================================================
	{
		files: [
			'src/**/hooks/utils/useWaasFeeOptions.tsx',
			'src/**/hooks/utils/waasFeeOptionsStore.ts',
			'src/**/hooks/utils/useAutoSelectFeeOption.tsx',
		],
		rules: {
			'@sequence/types/enforce-address-type': 'off',
			'@sequence/types/enforce-amount-type': 'off',
		},
	},

	// ============================================================
	// LEGACY TYPES & INPUT NORMALIZERS: Backward compatibility strings
	// ============================================================
	{
		files: [
			'src/**/hooks/checkout/primary-sale-checkout-options.tsx',
			'src/**/utils/normalizePriceFilters.ts',
			'src/**/hooks/ui/useFilters.tsx',
			'src/**/hooks/ui/useCollectibleCardOfferState.ts',
		],
		rules: {
			'@sequence/types/enforce-address-type': 'off',
			'@sequence/types/enforce-amount-type': 'off',
		},
	},

	// ============================================================
	// QUERY DATA TYPES: Serialized response values
	// ============================================================
	{
		files: [
			'src/**/queries/inventory/inventory.ts',
			'src/**/queries/collectible/primary-sale-item.ts',
		],
		rules: {
			'@sequence/types/enforce-address-type': 'off',
			'@sequence/types/enforce-amount-type': 'off',
		},
	},

	// ============================================================
	// API INPUT TYPES: Values passed to APIs as strings
	// ============================================================
	{
		files: [
			'src/react/_internal/types.ts',
			'src/types/transactions.ts',
		],
		rules: {
			'@sequence/types/enforce-amount-type': 'off',
		},
	},

	// ============================================================
	// ERROR TYPES & DECODERS: String for display/raw data
	// ============================================================
	{
		files: [
			'src/utils/_internal/error/*.ts',
			'src/utils/decode/*.ts',
		],
		rules: {
			'@sequence/types/enforce-address-type': 'off',
			'@sequence/types/enforce-token-id-type': 'off',
		},
	},

	// ============================================================
	// TRANSACTION HOOKS: Heavy wagmi/viem interaction with any types
	// ============================================================
	{
		files: ['src/**/hooks/transactions/*.{ts,tsx}'],
		rules: {
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-enum-comparison': 'off',
		},
	},

	// ============================================================
	// WAAS HOOKS: External SDK types have weak typing
	// ============================================================
	{
		files: ['src/**/hooks/utils/useWaasFeeOptions.tsx'],
		rules: {
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
		},
	},

	// ============================================================
	// MEDIA COMPONENT: External media handling with dynamic types
	// ============================================================
	{
		files: ['src/**/ui/components/media/Media.tsx'],
		rules: {
			'@typescript-eslint/no-unsafe-assignment': 'off',
		},
	},

	// ============================================================
	// MODAL INTERNAL COMPONENTS: Complex external integrations
	// ============================================================
	{
		files: [
			'src/**/ui/modals/_internal/components/**/*.{ts,tsx}',
			'src/**/ui/modals/BuyModal/internal/*.ts',
			'src/**/ui/modals/BuyModal/hooks/*.ts',
			'src/**/ui/modals/BuyModal/components/**/*.ts',
		],
		rules: {
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-enum-comparison': 'off',
		},
	},

	// ============================================================
	// INTERNAL API & UTILS: Dynamic object handling
	// ============================================================
	{
		files: [
			'src/react/_internal/api/*.ts',
			'src/react/_internal/utils.ts',
		],
		rules: {
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
		},
	},

	// ============================================================
	// NETWORK UTILS: Enum comparisons with external data
	// ============================================================
	{
		files: ['src/utils/network.ts'],
		rules: {
			'@typescript-eslint/no-unsafe-enum-comparison': 'off',
		},
	},

	// ============================================================
	// BUILD CONFIG FILES: JS imports with weak types
	// ============================================================
	{
		files: ['tsdown.config.ts'],
		rules: {
			'@typescript-eslint/no-unsafe-call': 'off',
		},
	},

	// ============================================================
	// TEST FILES: Relaxed rules for testing
	// ============================================================
	{
		files: [
			'src/**/*.test.ts',
			'src/**/*.test.tsx',
			'src/**/__tests__/**',
			'src/**/*.stories.ts',
			'src/**/*.stories.tsx',
			'src/**/*.mock-data.ts',
			'test/**',
		],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			'no-restricted-syntax': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/require-await': 'off',
			'@typescript-eslint/consistent-type-assertions': 'off',
			'@typescript-eslint/unbound-method': 'off',
			'@typescript-eslint/no-unnecessary-type-assertion': 'off',
			'no-restricted-imports': 'off',
			'@sequence/types/enforce-address-type': 'off',
			'@sequence/types/enforce-token-id-type': 'off',
			'@sequence/types/enforce-amount-type': 'off',
			'@sequence/types/enforce-chain-id-type': 'off',
			'@sequence/types/no-string-bigint-fields': 'off',
		},
	},

	...storybook.configs['flat/recommended'],
];
