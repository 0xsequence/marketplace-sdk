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

	{
		rules: {
			'react/react-in-jsx-scope': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-non-null-assertion': 'error',
			'@typescript-eslint/no-unsafe-assignment': 'warn',
			'@typescript-eslint/no-unsafe-member-access': 'warn',
			'@typescript-eslint/no-unsafe-call': 'warn',
			'@typescript-eslint/no-unsafe-return': 'warn',
			'@typescript-eslint/no-unsafe-argument': 'warn',
			'@typescript-eslint/no-unsafe-enum-comparison': 'warn',
			'@typescript-eslint/consistent-type-assertions': [
				'warn',
				{
					assertionStyle: 'as',
					objectLiteralTypeAssertions: 'allow',
				},
			],
			'@typescript-eslint/no-redundant-type-constituents': 'warn',
			'@typescript-eslint/require-await': 'warn',
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
			'no-restricted-syntax': [
				'warn',
				{
					selector: 'TSTemplateLiteralType',
					message:
						'Don\'t use `0x${string}` directly. Import and use `Address` from @0xsequence/api-client instead.',
				},
				{
					selector:
						'Literal[value="0x0000000000000000000000000000000000000000"]',
					message:
						'Don\'t use literal zero address. Import and use `zeroAddress` from viem instead.',
				},
			],
			'@typescript-eslint/ban-ts-comment': [
				'error',
				{
					'ts-expect-error': 'allow-with-description',
					'ts-ignore': true,
					'ts-nocheck': true,
				},
			],
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

	{
		files: ['src/**/*url-state*/**', 'src/**/*url*state*/**'],
		rules: {
			'@sequence/types/enforce-address-type': 'off',
			'@sequence/types/enforce-amount-type': 'off',
		},
	},

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

	{
		files: ['src/types/waas-types.ts'],
		rules: {
			'@sequence/types/enforce-address-type': 'off',
			'@sequence/types/enforce-token-id-type': 'off',
			'@sequence/types/enforce-amount-type': 'off',
		},
	},

	{
		files: ['src/utils/address.ts'],
		rules: {
			'@sequence/types/enforce-address-type': 'off',
		},
	},

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

	{
		files: [
			'src/react/_internal/types.ts',
			'src/types/transactions.ts',
		],
		rules: {
			'@sequence/types/enforce-amount-type': 'off',
		},
	},

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

	{
		files: ['src/**/hooks/transactions/*.{ts,tsx}'],
		rules: {
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-enum-comparison': 'off',
		},
	},

	{
		files: ['src/**/hooks/utils/useWaasFeeOptions.tsx'],
		rules: {
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
		},
	},

	{
		files: ['src/**/ui/components/media/Media.tsx'],
		rules: {
			'@typescript-eslint/no-unsafe-assignment': 'off',
		},
	},

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

	{
		files: ['src/utils/network.ts'],
		rules: {
			'@typescript-eslint/no-unsafe-enum-comparison': 'off',
		},
	},

	{
		files: ['tsdown.config.ts'],
		rules: {
			'@typescript-eslint/no-unsafe-call': 'off',
		},
	},

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
