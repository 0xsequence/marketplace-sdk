import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,

	reporter: [['html', { outputFolder: '../playwright-report' }], ['list']],

	use: {
		baseURL: process.env.E2E_BASE_URL || 'http://localhost:4444',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'on-first-retry',
	},

	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],

	webServer: {
		command:
			'pnpm --filter "sequence-marketplace-sdk-playground-react-vite" dev',
		url: 'http://localhost:4444',
		reuseExistingServer: !process.env.CI,
		timeout: 120000,
		cwd: '..',
	},

	timeout: 30000,

	expect: {
		timeout: 10000,
	},

	outputDir: './test-results',
});
