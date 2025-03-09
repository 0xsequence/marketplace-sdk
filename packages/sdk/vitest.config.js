import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [vanillaExtractPlugin()],
	test: {
		environment: 'jsdom',
		setupFiles: ['./test/setup.ts'],
		include: ['./**/*.test.{ts,tsx}'],
	},
});
