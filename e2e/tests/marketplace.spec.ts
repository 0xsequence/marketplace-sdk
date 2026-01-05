import { expect, test } from '../fixtures';

test.describe('Marketplace Browsing', () => {
	test('should load the marketplace page', async ({ page }) => {
		await page.goto('/');

		await expect(
			page.getByText('Sequence Marketplace SDK Playground'),
		).toBeVisible();
	});

	test('should navigate to market tab', async ({ page }) => {
		await page.goto('/');

		await page.getByRole('button', { name: 'Market' }).click();

		await expect(page).toHaveURL(/\/market/);
	});

	test('should navigate to shop tab', async ({ page }) => {
		await page.goto('/');

		await page.getByRole('button', { name: 'Shop' }).click();

		await expect(page).toHaveURL(/\/shop/);
	});

	test('should have no critical console errors on initial load', async ({
		page,
	}) => {
		const consoleErrors: string[] = [];

		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				consoleErrors.push(msg.text());
			}
		});

		await page.goto('/');

		await page.waitForLoadState('networkidle');

		const criticalErrors = consoleErrors.filter(
			(err) =>
				!err.includes('favicon') &&
				!err.includes('404') &&
				!err.includes('net::ERR') &&
				!err.includes('CORS') &&
				!err.includes('ipfs://') &&
				!err.includes('Failed to load resource'),
		);

		expect(criticalErrors).toHaveLength(0);
	});
});

test.describe('Wallet Connection', () => {
	test('should inject wallet mock', async ({ page, walletMock }) => {
		await page.goto('/');

		const hasEthereum = await page.evaluate(() => {
			return typeof (window as any).ethereum !== 'undefined';
		});

		expect(hasEthereum).toBe(true);
	});

	test('should connect wallet via mock', async ({ page, walletMock }) => {
		await page.goto('/');

		const accounts = await walletMock.connect();

		expect(accounts).toHaveLength(1);
		expect(accounts[0]).toBe('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
	});

	test('should get correct chain id', async ({ page, walletMock }) => {
		await page.goto('/');

		await walletMock.connect();

		const chainId = await walletMock.getChainId();

		expect(chainId).toBe('0x1');
	});

	test('should switch chains', async ({ page, walletMock }) => {
		await page.goto('/');

		await walletMock.connect();
		await walletMock.switchChain(137);

		const chainId = await walletMock.getChainId();

		expect(chainId).toBe('0x89');
	});

	test('should disconnect wallet', async ({ page, walletMock }) => {
		await page.goto('/');

		await walletMock.connect();
		await walletMock.disconnect();

		const accounts = await walletMock.getAccounts();

		expect(accounts).toHaveLength(0);
	});
});
