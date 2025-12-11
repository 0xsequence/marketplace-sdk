import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: ['src/index.ts', 'src/types/index.ts', 'src/__mocks__/**/*.ts'],
	dts: true,
	platform: 'neutral',
	sourcemap: true,
	format: ['esm'],
	outDir: 'dist',
	clean: true,
	hash: false,
});
