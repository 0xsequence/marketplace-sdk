import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import preserveDirectives from 'rollup-preserve-directives';
import { defineConfig } from 'tsdown';

const execAsync = promisify(exec);

export default defineConfig([
	{
		entry: ['src/**/index.ts', '!src/**/__tests__/**', '!src/**/*.test.*'],
		dts: true,
		platform: 'neutral',
		sourcemap: true,
		format: ['esm'],
		outDir: 'dist',
		clean: true,
		plugins: [preserveDirectives()],
		onSuccess: () => {
			execAsync('pnpm tailwindcss -i ./src/index.css -o ./dist/index.css');
		},
		loader: {
			'.png': 'dataurl',
		},
	},
]);
