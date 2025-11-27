import { defineConfig } from 'tsdown';

// @ts-expect-error - Js file
import { generateStyles } from './compile-tailwind.js';
import { preserveDirectives } from './plugins/preserve-directives.ts';

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
		dts: true,
		platform: 'neutral',
		sourcemap: true,
		format: ['esm'],
		outDir: 'dist',
		clean: true,
		plugins: [tailwindPlugin(), preserveDirectives()],
		loader: {
			'.png': 'dataurl',
		},
	},
]);
