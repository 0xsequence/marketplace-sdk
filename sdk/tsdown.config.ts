// import preserveDirectives from 'rollup-preserve-directives';
import { defineConfig } from 'tsdown';

export default defineConfig([
	{
		entry: ['src/**/index.ts', '!src/**/__tests__/**', '!src/**/*.test.*'],
		dts: true,
		sourcemap: true,
		format: ['esm'],
		outDir: 'dist',
		clean: true,
		//  plugins: [preserveDirectives()],
		loader: {
			'.png': 'dataurl',
		},
	},
]);
