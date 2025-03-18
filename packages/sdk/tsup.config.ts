import { type Options, defineConfig } from 'tsup';

const _default_1:
	| Options
	| Options[]
	| ((
			overrideOptions: Options,
	  ) => Options | Options[] | Promise<Options | Options[]>) = defineConfig([
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
		entry: ['src/index.css'],
		outDir: 'dist',
		format: ['esm'],
	},
]);
export default _default_1;
