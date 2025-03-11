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
		esbuildOptions(options) {
			options.banner = {
				js: '"use client"',
			};
		},
		loader: {
			'.png': 'dataurl',
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
	},
]);
