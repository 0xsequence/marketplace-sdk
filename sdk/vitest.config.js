import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		environment: 'jsdom',
		setupFiles: ['./test/setup.ts'],
		globalSetup: './test/globalSetup.ts',
		include: ['./**/*.test.{ts,tsx}'],
		server: {
			deps: {
				inline: [
					'@0xsequence/connect',
					'@0xsequence/hooks',
					'@0xsequence/checkout',
				],
			},
		},
	},
});
