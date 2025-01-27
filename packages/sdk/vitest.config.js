import { defineConfig } from "vitest/config";
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  plugins: [vanillaExtractPlugin()],
	test: {
		environment: "happy-dom",
		include: ["./**/*.test.{ts,tsx}"],
	},
});
