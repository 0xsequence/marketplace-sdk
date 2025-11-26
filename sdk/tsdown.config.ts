import preserveDirectives from 'rollup-preserve-directives';
import { defineConfig } from 'tsdown';

// @ts-expect-error - Js file
import { generateStyles } from './compile-tailwind.js';

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
		entry: ['src/**/index.ts', '!src/**/__tests__/**', '!src/**/*.test.*'],
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
		external: ['tldts-core', 'tldts'],
	},
]);
