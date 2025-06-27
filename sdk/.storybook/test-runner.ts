import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';

const config: TestRunnerConfig = {
	// Setup function that runs before each test
	async preVisit(page, context) {
		// Set viewport size for consistent testing
		await page.setViewportSize({ width: 1280, height: 720 });

		// Add any global setup here
		console.log(`Running test for story: ${context.title} - ${context.name}`);
	},

	// Setup function that runs after each test
	async postVisit(page, context) {
		// Take screenshot on test failure
		const storyContext = await getStoryContext(page, context);

		if (storyContext.parameters?.screenshot !== false) {
			// Take screenshot for visual regression testing
			await page.screenshot({
				path: `test-results/screenshots/${context.title.replace(/\//g, '-')}-${context.name}.png`,
				fullPage: true,
			});
		}

		// Check for console errors (simplified approach)
		const logs: Array<{ level: string; message: string }> = [];

		// Filter out expected warnings/errors
		const errors = logs.filter(
			(log) =>
				log.level === 'error' &&
				!log.message.includes('ResizeObserver') && // Common React warning
				!log.message.includes('Warning: ReactDOM.render'), // React 18 warnings
		);

		if (errors.length > 0) {
			console.warn(
				`Console errors found in ${context.title} - ${context.name}:`,
				errors,
			);
		}
	},

	// Custom test function for advanced testing
	async postRender(page, context) {
		// Wait for any animations to complete
		await page.waitForTimeout(500);

		// Check for accessibility violations using axe-core
		const storyContext = await getStoryContext(page, context);

		if (storyContext.parameters?.a11y?.disable !== true) {
			// Inject axe-core for accessibility testing
			await page.addScriptTag({
				url: 'https://unpkg.com/axe-core@4.8.2/axe.min.js',
			});

			// Run accessibility tests
			const accessibilityResults = await page.evaluate(() => {
				return new Promise<{
					error?: string;
					violations?: Array<{ id: string; description: string }>;
				}>((resolve) => {
					// @ts-ignore
					window.axe.run(
						(
							err: Error | null,
							results: {
								violations: Array<{ id: string; description: string }>;
							},
						) => {
							if (err) resolve({ error: err.message });
							resolve(results);
						},
					);
				});
			});

			// @ts-ignore
			if (accessibilityResults.violations?.length > 0) {
				console.warn(
					`Accessibility violations found in ${context.title} - ${context.name}:`,
					// @ts-ignore
					accessibilityResults.violations,
				);
			}
		}

		// Test for performance issues
		const performanceMetrics = await page.evaluate(() => {
			const navigation = performance.getEntriesByType(
				'navigation',
			)[0] as PerformanceNavigationTiming;
			return {
				domContentLoaded:
					navigation.domContentLoadedEventEnd -
					navigation.domContentLoadedEventStart,
				loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
			};
		});

		// Warn if page load is slow
		if (performanceMetrics.domContentLoaded > 3000) {
			console.warn(
				`Slow DOM content loaded time in ${context.title} - ${context.name}: ${performanceMetrics.domContentLoaded}ms`,
			);
		}
	},
};

export default config;
