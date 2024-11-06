import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin';
import { defineConfig } from 'tsup';

export default defineConfig([
	{
		entry: ['src/**/index.ts', '!src/react/**'],
		dts: true,
		sourcemap: true,
		format: ['esm'],
	},
	{
		entry: ['src/**/index.ts', '!src/react/ssr/index.ts'],
		dts: true,
		sourcemap: true,
		format: ['esm'],
		esbuildPlugins: [vanillaExtractPlugin()],
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
	{
		entry: ['src/styles/index.ts'],
		outDir: 'dist',
		format: ['esm'],
		esbuildPlugins: [vanillaExtractPlugin()],
	},
]);
