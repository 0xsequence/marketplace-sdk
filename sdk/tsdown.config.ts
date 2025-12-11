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
		external: ['wagmi', '@tanstack/react-query'],
		outDir: 'dist',
		clean: true,
		hash: false,
		plugins: [tailwindPlugin(), preserveDirectives()],
		loader: {
			'.png': 'dataurl',
		},
	},
]);
