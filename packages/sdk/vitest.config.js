import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		environment: 'jsdom',
		setupFiles: ['./src/test/setup.ts'],
		globalSetup: './src/test/globalSetup.ts',
		include: ['./**/*.test.{ts,tsx}'],
	},
});
