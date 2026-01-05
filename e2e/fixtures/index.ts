import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Page } from '@playwright/test';
import { test as base, expect } from '@playwright/test';
import { TEST_ACCOUNTS, TEST_PRIVATE_KEYS } from './test-constants';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const walletMockPath = path.join(__dirname, 'wallet-mock.js');

export interface WalletMock {
	connect: () => Promise<string[]>;
	disconnect: () => Promise<void>;
	switchChain: (chainId: number) => Promise<void>;
	getAccounts: () => Promise<string[]>;
	getChainId: () => Promise<string>;
}

export interface TestFixtures {
	walletMock: WalletMock;
	connectedPage: Page;
}

export const test = base.extend<TestFixtures>({
	walletMock: async ({ page }, use) => {
		await page.addInitScript({
			path: walletMockPath,
		});

		const walletMock: WalletMock = {
			connect: async () => {
				return page.evaluate(() => {
					return (window as any).__walletMock.connect();
				});
			},
			disconnect: async () => {
				return page.evaluate(() => {
					return (window as any).__walletMock.disconnect();
				});
			},
			switchChain: async (chainId: number) => {
				return page.evaluate((id) => {
					return (window as any).__walletMock.switchChain(id);
				}, chainId);
			},
			getAccounts: async () => {
				return page.evaluate(() => {
					return (window as any).__walletMock.getAccounts();
				});
			},
			getChainId: async () => {
				return page.evaluate(() => {
					return (window as any).__walletMock.getChainId();
				});
			},
		};

		await use(walletMock);
	},

	connectedPage: async ({ page, walletMock }, use) => {
		await page.addInitScript({
			path: walletMockPath,
		});

		await page.goto('/');
		await walletMock.connect();
		await use(page);
	},
});

export { expect, TEST_ACCOUNTS, TEST_PRIVATE_KEYS };
