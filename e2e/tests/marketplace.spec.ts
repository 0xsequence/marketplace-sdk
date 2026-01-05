import { expect, test } from '../fixtures';

test.describe('Marketplace Browsing', () => {
	test.describe.configure({ timeout: 60000 });
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

test.describe('Market Collection Flow', () => {
	test.describe.configure({ timeout: 60000 });

	test('should display collections on market page', async ({ page }) => {
		await page.goto('/market');
		await page.waitForLoadState('networkidle');

		const collectionCards = page.locator('[style*="cursor: pointer"]');
		await expect(collectionCards.first()).toBeVisible({ timeout: 15000 });

		const cardCount = await collectionCards.count();
		expect(cardCount).toBeGreaterThan(0);
	});

	test('should navigate to collection and show collectibles', async ({
		page,
	}) => {
		await page.goto('/market');
		await page.waitForLoadState('networkidle');

		const collectionCard = page.locator('[style*="cursor: pointer"]').first();
		await expect(collectionCard).toBeVisible({ timeout: 15000 });
		await collectionCard.click();

		await expect(page).toHaveURL(/\/market\/\d+\/0x/, { timeout: 10000 });
		await page.waitForLoadState('networkidle');

		const hasContent =
			(await page.locator('[style*="cursor: pointer"]').count()) > 0 ||
			(await page.getByText(/No items found/i).count()) > 0 ||
			(await page.getByText(/loading/i).count()) > 0;

		expect(hasContent).toBe(true);
	});

	test('should navigate to collectible detail page', async ({ page }) => {
		await page.goto('/market');
		await page.waitForLoadState('networkidle');

		const collectionCard = page.locator('[style*="cursor: pointer"]').first();
		await expect(collectionCard).toBeVisible({ timeout: 15000 });
		await collectionCard.click();

		await expect(page).toHaveURL(/\/market\/\d+\/0x/, { timeout: 10000 });

		await page.waitForTimeout(2000);
		await page.waitForLoadState('networkidle');

		const collectibleCard = page.locator('[style*="cursor: pointer"]').first();
		const hasCollectibles = (await collectibleCard.count()) > 0;

		if (hasCollectibles) {
			await expect(collectibleCard).toBeVisible({ timeout: 10000 });
			await collectibleCard.click({ force: true });
			await page.waitForLoadState('networkidle');
			await expect(page).toHaveURL(/\/market\/\d+\/0x[a-fA-F0-9]+\/\d+/, {
				timeout: 10000,
			});
		}
	});
});

test.describe('Market Actions (with wallet)', () => {
	test.describe.configure({ timeout: 90000 });

	test('should show action buttons on collectible page when connected', async ({
		page,
		walletMock,
	}) => {
		await page.goto('/market');
		await page.waitForLoadState('networkidle');

		await walletMock.connect();

		const collectionCard = page.locator('[style*="cursor: pointer"]').first();
		const hasCollection = (await collectionCard.count()) > 0;

		if (!hasCollection) {
			test.skip();
			return;
		}

		await collectionCard.click();
		await expect(page).toHaveURL(/\/market\/\d+\/0x/, { timeout: 10000 });

		await page.waitForTimeout(2000);
		await page.waitForLoadState('networkidle');

		const collectibleCard = page.locator('[style*="cursor: pointer"]').first();
		const hasCollectibles = (await collectibleCard.count()) > 0;

		if (!hasCollectibles) {
			test.skip();
			return;
		}

		await expect(collectibleCard).toBeVisible({ timeout: 10000 });
		await collectibleCard.click({ force: true });
		await expect(page).toHaveURL(/\/market\/\d+\/0x[a-fA-F0-9]+\/\d+/, {
			timeout: 10000,
		});
		await page.waitForLoadState('networkidle');

		const buyButton = page.getByRole('button', { name: /Buy Now/i });
		const makeOfferButton = page.getByRole('button', { name: /Make Offer/i });
		const createListingButton = page.getByRole('button', {
			name: /Create Listing/i,
		});

		const hasBuyAction = (await buyButton.count()) > 0;
		const hasOfferAction = (await makeOfferButton.count()) > 0;
		const hasListingAction = (await createListingButton.count()) > 0;

		expect(hasBuyAction || hasOfferAction || hasListingAction).toBe(true);
	});
});
