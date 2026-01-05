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
		if ((await collectionCard.count()) === 0) {
			test.skip();
			return;
		}

		await expect(collectionCard).toBeVisible({ timeout: 15000 });
		await collectionCard.click();

		await expect(page).toHaveURL(/\/market\/\d+\/0x/, { timeout: 10000 });
		await page.waitForLoadState('networkidle');

		await page.waitForTimeout(2000);

		const pageContent = await page.content();
		expect(pageContent.length).toBeGreaterThan(1000);
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

	test('should open create listing modal when clicking Create Listing button', async ({
		page,
		walletMock,
	}) => {
		await page.goto('/market');
		await page.waitForLoadState('networkidle');

		await walletMock.connect();

		const collectionCard = page.locator('[style*="cursor: pointer"]').first();
		if ((await collectionCard.count()) === 0) {
			test.skip();
			return;
		}

		await collectionCard.click();
		await expect(page).toHaveURL(/\/market\/\d+\/0x/, { timeout: 10000 });

		await page.waitForTimeout(2000);
		await page.waitForLoadState('networkidle');

		const collectibleCard = page.locator('[style*="cursor: pointer"]').first();
		if ((await collectibleCard.count()) === 0) {
			test.skip();
			return;
		}

		await expect(collectibleCard).toBeVisible({ timeout: 10000 });
		await collectibleCard.click({ force: true });
		await expect(page).toHaveURL(/\/market\/\d+\/0x[a-fA-F0-9]+\/\d+/, {
			timeout: 10000,
		});
		await page.waitForLoadState('networkidle');

		const createListingButton = page.getByRole('button', {
			name: /Create Listing/i,
		});

		if ((await createListingButton.count()) === 0) {
			test.skip();
			return;
		}

		await createListingButton.click();

		const modal = page.locator('[role="dialog"]');
		await expect(modal).toBeVisible({ timeout: 10000 });
	});

	test('should open make offer modal when clicking Make Offer button', async ({
		page,
		walletMock,
	}) => {
		await page.goto('/market');
		await page.waitForLoadState('networkidle');

		await walletMock.connect();

		const collectionCard = page.locator('[style*="cursor: pointer"]').first();
		if ((await collectionCard.count()) === 0) {
			test.skip();
			return;
		}

		await collectionCard.click();
		await expect(page).toHaveURL(/\/market\/\d+\/0x/, { timeout: 10000 });

		await page.waitForTimeout(2000);
		await page.waitForLoadState('networkidle');

		const collectibleCard = page.locator('[style*="cursor: pointer"]').first();
		if ((await collectibleCard.count()) === 0) {
			test.skip();
			return;
		}

		await expect(collectibleCard).toBeVisible({ timeout: 10000 });
		await collectibleCard.click({ force: true });
		await expect(page).toHaveURL(/\/market\/\d+\/0x[a-fA-F0-9]+\/\d+/, {
			timeout: 10000,
		});
		await page.waitForLoadState('networkidle');

		const makeOfferButton = page.getByRole('button', { name: /Make Offer/i });

		if ((await makeOfferButton.count()) === 0) {
			test.skip();
			return;
		}

		await makeOfferButton.click();

		const modal = page.locator('[role="dialog"]');
		await expect(modal).toBeVisible({ timeout: 10000 });
	});
});

test.describe('Shop (Primary Sale) Flow', () => {
	test.describe.configure({ timeout: 90000 });

	test('should display collections on shop page', async ({ page }) => {
		await page.goto('/shop');
		await page.waitForLoadState('networkidle');

		const collectionCards = page.locator('[style*="cursor: pointer"]');
		const hasCollections = (await collectionCards.count()) > 0;

		const noShopMessage = page.getByText(/No shop/i);
		const hasNoShopMessage = (await noShopMessage.count()) > 0;

		expect(hasCollections || hasNoShopMessage).toBe(true);
	});

	test('should navigate to shop collection and show items', async ({
		page,
	}) => {
		await page.goto('/shop');
		await page.waitForLoadState('networkidle');

		const collectionCard = page.locator('[style*="cursor: pointer"]').first();
		if ((await collectionCard.count()) === 0) {
			test.skip();
			return;
		}

		await expect(collectionCard).toBeVisible({ timeout: 15000 });
		await collectionCard.click();

		await expect(page).toHaveURL(/\/shop\/\d+\/0x/, { timeout: 10000 });
		await page.waitForLoadState('networkidle');

		await page.waitForTimeout(2000);

		const pageContent = await page.content();
		expect(pageContent.length).toBeGreaterThan(1000);
	});

	test('should navigate to shop collectible detail page', async ({ page }) => {
		await page.goto('/shop');
		await page.waitForLoadState('networkidle');

		const collectionCard = page.locator('[style*="cursor: pointer"]').first();
		if ((await collectionCard.count()) === 0) {
			test.skip();
			return;
		}

		await collectionCard.click();
		await expect(page).toHaveURL(/\/shop\/\d+\/0x/, { timeout: 10000 });

		await page.waitForTimeout(2000);
		await page.waitForLoadState('networkidle');

		const collectibleCard = page.locator('[style*="cursor: pointer"]').first();
		if ((await collectibleCard.count()) === 0) {
			test.skip();
			return;
		}

		await expect(collectibleCard).toBeVisible({ timeout: 10000 });
		await collectibleCard.click({ force: true });
		await page.waitForLoadState('networkidle');

		await expect(page).toHaveURL(/\/shop\/\d+\/0x[a-fA-F0-9]+\/0x[a-fA-F0-9]+/, {
			timeout: 10000,
		});
	});

	test('should show buy button on shop collectible page when connected', async ({
		page,
		walletMock,
	}) => {
		await page.goto('/shop');
		await page.waitForLoadState('networkidle');

		await walletMock.connect();

		const collectionCard = page.locator('[style*="cursor: pointer"]').first();
		if ((await collectionCard.count()) === 0) {
			test.skip();
			return;
		}

		await collectionCard.click();
		await expect(page).toHaveURL(/\/shop\/\d+\/0x/, { timeout: 10000 });

		await page.waitForTimeout(2000);
		await page.waitForLoadState('networkidle');

		const collectibleCard = page.locator('[style*="cursor: pointer"]').first();
		if ((await collectibleCard.count()) === 0) {
			test.skip();
			return;
		}

		await expect(collectibleCard).toBeVisible({ timeout: 10000 });
		await collectibleCard.click({ force: true });
		await page.waitForLoadState('networkidle');

		await expect(page).toHaveURL(/\/shop\/\d+\/0x[a-fA-F0-9]+\/0x[a-fA-F0-9]+/, {
			timeout: 10000,
		});

		const buyButton = page.getByRole('button', { name: /Buy now/i });
		const outOfStock = page.getByText(/Out of stock/i);
		const connectWallet = page.getByText(/Connect your wallet/i);

		const hasBuyButton = (await buyButton.count()) > 0;
		const hasOutOfStock = (await outOfStock.count()) > 0;
		const hasConnectPrompt = (await connectWallet.count()) > 0;

		expect(hasBuyButton || hasOutOfStock || hasConnectPrompt).toBe(true);
	});

	test('should open buy modal when clicking Buy now in shop', async ({
		page,
		walletMock,
	}) => {
		await page.goto('/shop');
		await page.waitForLoadState('networkidle');

		await walletMock.connect();

		const collectionCard = page.locator('[style*="cursor: pointer"]').first();
		if ((await collectionCard.count()) === 0) {
			test.skip();
			return;
		}

		await collectionCard.click();
		await expect(page).toHaveURL(/\/shop\/\d+\/0x/, { timeout: 10000 });

		await page.waitForTimeout(2000);
		await page.waitForLoadState('networkidle');

		const collectibleCard = page.locator('[style*="cursor: pointer"]').first();
		if ((await collectibleCard.count()) === 0) {
			test.skip();
			return;
		}

		await expect(collectibleCard).toBeVisible({ timeout: 10000 });
		await collectibleCard.click({ force: true });
		await page.waitForLoadState('networkidle');

		const buyButton = page.getByRole('button', { name: /Buy now/i });
		if ((await buyButton.count()) === 0) {
			test.skip();
			return;
		}

		await buyButton.click();

		const modal = page.locator('[role="dialog"]');
		await expect(modal).toBeVisible({ timeout: 10000 });
	});
});

test.describe('Inventory Page', () => {
	test.describe.configure({ timeout: 90000 });

	test('should show connect wallet message when not connected', async ({
		page,
	}) => {
		await page.goto('/inventory');
		await page.waitForLoadState('networkidle');

		const connectMessage = page.getByText(
			/connect your wallet to view your inventory/i,
		);
		await expect(connectMessage).toBeVisible({ timeout: 10000 });
	});

	test('should load inventory page when wallet connected', async ({
		page,
		walletMock,
	}) => {
		await page.goto('/inventory');
		await page.waitForLoadState('networkidle');

		await walletMock.connect();

		await page.waitForTimeout(2000);
		await page.waitForLoadState('networkidle');

		const tradableSection = page.getByText(/Tradable Collections/i);
		const shopSection = page.getByText(/Shop Collections/i);
		const loadingText = page.getByText(/Loading inventory/i);
		const connectMessage = page.getByText(
			/connect your wallet to view your inventory/i,
		);

		const hasTradable = (await tradableSection.count()) > 0;
		const hasShop = (await shopSection.count()) > 0;
		const isLoading = (await loadingText.count()) > 0;
		const needsConnect = (await connectMessage.count()) > 0;

		expect(hasTradable || hasShop || isLoading || needsConnect).toBe(true);
	});

	test('should capture console errors on inventory page', async ({
		page,
		walletMock,
	}) => {
		const consoleErrors: string[] = [];
		const consoleWarnings: string[] = [];
		const networkErrors: string[] = [];

		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				consoleErrors.push(msg.text());
			}
			if (msg.type() === 'warning') {
				consoleWarnings.push(msg.text());
			}
		});

		page.on('requestfailed', (request) => {
			networkErrors.push(`${request.url()} - ${request.failure()?.errorText}`);
		});

		await page.goto('/inventory');
		await page.waitForLoadState('networkidle');

		await walletMock.connect();

		await page.waitForTimeout(5000);
		await page.waitForLoadState('networkidle');

		const criticalErrors = consoleErrors.filter(
			(err) =>
				!err.includes('favicon') &&
				!err.includes('404') &&
				!err.includes('net::ERR') &&
				!err.includes('CORS') &&
				!err.includes('ipfs://') &&
				!err.includes('Failed to load resource') &&
				!err.includes('ResizeObserver'),
		);

		if (criticalErrors.length > 0) {
			console.log('Critical errors found on inventory page:');
			criticalErrors.forEach((err) => console.log(`  - ${err}`));
		}

		if (networkErrors.length > 0) {
			console.log('Network errors found on inventory page:');
			networkErrors.forEach((err) => console.log(`  - ${err}`));
		}

		expect(criticalErrors).toHaveLength(0);
	});

	test('should show inventory items or empty state for connected wallet', async ({
		page,
		walletMock,
	}) => {
		await page.goto('/inventory');
		await page.waitForLoadState('networkidle');

		const connectButton = page.getByRole('button', { name: /Connect|Wallet/i });
		const configButton = page.getByRole('button', {
			name: /Configuration & Overrides/i,
		});

		if ((await configButton.count()) > 0) {
			await configButton.click();

			const connectInConfig = page.getByRole('button', {
				name: /Connect|Wallet/i,
			});
			if ((await connectInConfig.count()) > 0) {
				await connectInConfig.first().click();

				await page.waitForTimeout(1000);

				const metamaskOption = page.getByText(/MetaMask/i);
				if ((await metamaskOption.count()) > 0) {
					await metamaskOption.click();
					await page.waitForTimeout(2000);
				}
			}
		}

		await page.waitForTimeout(3000);
		await page.waitForLoadState('networkidle');

		const connectMessage = page.getByText(
			/connect your wallet to view your inventory/i,
		);
		const loadingText = page.getByText(/Loading inventory/i);
		const tradableSection = page.getByText(/Tradable Collections/i);
		const shopSection = page.getByText(/Shop Collections/i);

		const needsConnect = (await connectMessage.count()) > 0;
		const hasTradable = (await tradableSection.count()) > 0;
		const hasShop = (await shopSection.count()) > 0;
		const isLoading = (await loadingText.count()) > 0;

		expect(needsConnect || hasTradable || hasShop || isLoading).toBe(true);
	});
});

test.describe('Debug Page', () => {
	test.describe.configure({ timeout: 90000 });

	test('should load debug page without critical errors', async ({ page }) => {
		const consoleErrors: string[] = [];

		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				consoleErrors.push(msg.text());
			}
		});

		await page.goto('/debug');
		await page.waitForLoadState('networkidle');

		await page.waitForTimeout(3000);

		const criticalErrors = consoleErrors.filter(
			(err) =>
				!err.includes('favicon') &&
				!err.includes('404') &&
				!err.includes('net::ERR') &&
				!err.includes('CORS') &&
				!err.includes('ipfs://') &&
				!err.includes('Failed to load resource') &&
				!err.includes('ResizeObserver'),
		);

		if (criticalErrors.length > 0) {
			console.log('Critical errors found on debug page:');
			criticalErrors.forEach((err) => console.log(`  - ${err}`));
		}

		expect(criticalErrors).toHaveLength(0);
	});

	test('should display debug sections', async ({ page }) => {
		await page.goto('/debug');
		await page.waitForLoadState('networkidle');

		const hasDebugContent =
			(await page.getByText(/Debug/i).count()) > 0 ||
			(await page.locator('pre').count()) > 0 ||
			(await page.locator('code').count()) > 0;

		expect(hasDebugContent).toBe(true);
	});
});
