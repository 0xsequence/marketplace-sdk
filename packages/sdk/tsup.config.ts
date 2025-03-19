import { preserveDirectivesPlugin } from 'esbuild-plugin-preserve-directives';
import { defineConfig } from 'tsup';

export default defineConfig([
	{
		entry: ['src/**/index.ts'],
		dts: true,
		sourcemap: true,
		format: ['esm'],
		esbuildPlugins: [
			preserveDirectivesPlugin({
				directives: ['use client', 'use strict'],
				include: /\.(js|ts|jsx|tsx)$/,
				exclude: /node_modules/,
			}),
		],
		loader: {
			'.png': 'dataurl',
		},
	},
]);
