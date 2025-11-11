import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: [
		'src/index.ts',
		'src/types/index.ts',
		'src/__mocks__/metadata.msw.ts',
		'src/__mocks__/indexer.msw.ts',
		'src/__mocks__/builder.msw.ts',
		'src/__mocks__/marketplace.msw.ts',
	],
	format: ['esm'],
	dts: true,
	clean: true,
	external: [
		'viem',
		'msw',
		'@0xsequence/indexer',
		'@0xsequence/metadata',
		'@0xsequence/network',
	],
});
