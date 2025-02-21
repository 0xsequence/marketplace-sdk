import { defineConfig } from 'vitest/config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
	plugins: [vanillaExtractPlugin()],
	test: {
		environment: 'jsdom',
		setupFiles: ['./src/react/_internal/test/setup.ts'],
		include: ['./**/*.test.{ts,tsx}'],
	},
});
