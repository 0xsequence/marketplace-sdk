import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [vanillaExtractPlugin(), tsconfigPaths()],
	test: {
		environment: 'jsdom',
		setupFiles: ['./test/setup.ts'],
		globalSetup: './test/globalSetup.ts',
		include: ['./**/*.test.{ts,tsx}'],
	},
});
