import { defineConfig } from 'tsdown';

// @ts-expect-error - Js file
import { generateStyles } from './compile-tailwind.js';
import { preserveDirectives } from './preserve-directives.ts';

const tailwindPlugin = () => {
	return {
		name: 'tailwind',
		buildStart: async () => {
			await generateStyles({ copyCSS: true });
		},
	};
};

export default defineConfig([
	{
		entry: [
			'src/**/index.ts',
			'src/**/index.tsx',
			'!src/**/__tests__/**',
			'!src/**/*.test.*',
		],
		dts: {
			resolve: true,
		},
		platform: 'neutral',
		sourcemap: true,
		format: ['esm'],
		noExternal: ['@0xsequence/api-client'],
		external: [
			'viem',
			'wagmi',
			'@tanstack/react-query',
			'react',
			'react-dom',
			'@0xsequence/connect',
			'@0xsequence/network',
			'@0xsequence/indexer',
			'@0xsequence/metadata',
			'@0xsequence/waas',
			'@0xsequence/api',
			'@0xsequence/checkout',
			'0xsequence',
			'postcss',
			'@tailwindcss/cli',
			'@tailwindcss/oxide',
			'lightningcss',
		],
		outDir: 'dist',
		clean: true,
		hash: false,
		plugins: [tailwindPlugin(), preserveDirectives()],
		loader: {
			'.png': 'dataurl',
		},
	},
]);
