import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/**/*@(ts|tsx)'],
	dts: true,
	sourcemap: true,
	clean: true,
	format: ['esm'],
});
