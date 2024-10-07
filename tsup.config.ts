import { defineConfig } from 'tsup';

export default defineConfig([
	{
		entry: ['src/**/index.ts', '!src/react/**'],
		dts: true,
		sourcemap: true,
		clean: true,
		format: ['esm'],
	},
	{
		entry: ['src/**/index.ts', '!src/react/ssr/index.ts'],
		dts: true,
		sourcemap: true,
		format: ['esm'],
		esbuildOptions(options) {
			options.banner = {
				js: '"use client"',
			};
		},
	},
	{
		entry: { 'react/ssr/index': 'src/react/ssr/index.ts' },
		dts: true,
		sourcemap: true,
		format: ['esm'],
	},
]);
