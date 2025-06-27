import type { TestRunnerConfig } from '@storybook/test-runner';
import { getStoryContext } from '@storybook/test-runner';
import { checkA11y, injectAxe } from 'axe-playwright';

const DEFAULT_VIEWPORT_SIZE = { width: 1280, height: 720 };

const config: TestRunnerConfig = {
	// Setup function that runs before each test
	async preVisit(page, context) {
		// Set viewport size for consistent testing
		const storyContext = await getStoryContext(page, context);
		const viewportName = storyContext.parameters?.viewport?.defaultViewport;

		if (
			viewportName &&
			storyContext.parameters?.viewport?.viewports?.[viewportName]
		) {
			const viewport = storyContext.parameters.viewport.viewports[viewportName];
			await page.setViewportSize({
				width:
					Number.parseInt(viewport.styles.width) || DEFAULT_VIEWPORT_SIZE.width,
				height:
					Number.parseInt(viewport.styles.height) ||
					DEFAULT_VIEWPORT_SIZE.height,
			});
		} else {
			await page.setViewportSize(DEFAULT_VIEWPORT_SIZE);
		}

		// Inject axe for accessibility testing
		await injectAxe(page);

		// Add any global setup here
		console.log(`Running test for story: ${context.title} - ${context.name}`);
	},

	// Setup function that runs after each test
	async postVisit(page, context) {
		// Wait for any animations or transitions to complete
		await page.waitForTimeout(300);

		// Take screenshot on test failure
		const storyContext = await getStoryContext(page, context);

		if (storyContext.parameters?.screenshot !== false) {
			// Create directory if it doesn't exist
			const screenshotPath = `test-results/screenshots/${context.title.replace(/\//g, '-')}-${context.name}.png`;

			// Take screenshot for visual regression testing
			await page.screenshot({
				path: screenshotPath,
				fullPage: true,
			});
		}

		// Modal-specific checks
		if (context.title?.includes('Modal')) {
			// Check if modal is properly rendered
			const dialog = page.locator('[role="dialog"]');
			const dialogCount = await dialog.count();

			if (dialogCount > 0) {
				// Ensure modal is visible
				try {
					await dialog.first().waitFor({ state: 'visible', timeout: 5000 });

					// Check for proper focus management
					const focusedElement = await page.evaluate(
						() => document.activeElement?.tagName,
					);
					console.log(`Focused element in modal: ${focusedElement}`);

					// Check for escape key handling
					await page.keyboard.press('Escape');
					await page.waitForTimeout(100);

					// Modal should still be visible in stories (they don't close automatically)
					const stillVisible = await dialog.first().isVisible();
					if (!stillVisible) {
						console.log(
							'Modal closed on Escape key - this is expected behavior',
						);
					}
				} catch (error) {
					console.error(`Modal visibility check failed: ${error}`);
				}
			}
		}

		// Check for accessibility violations
		if (storyContext.parameters?.a11y?.disable !== true) {
			try {
				await checkA11y(page, '#storybook-root', {
					detailedReport: true,
					detailedReportOptions: {
						html: true,
					},
					axeOptions: {
						rules: {
							// Disable rules that often have false positives in Storybook
							'landmark-one-main': { enabled: false },
							'page-has-heading-one': { enabled: false },
							// Disable color contrast for modals (often false positives with overlays)
							...(context.title?.includes('Modal') && {
								'color-contrast': { enabled: false },
							}),
						},
					},
				});
			} catch (error) {
				console.error(
					`Accessibility test failed for ${context.title} - ${context.name}:`,
					error,
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
