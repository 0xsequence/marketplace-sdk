import { polygon } from 'viem/chains';
import { beforeEach, describe, expect, it } from 'vitest';
import { type Config, cookieStorage } from 'wagmi';
import type { SdkConfig } from '../../../../types';
import { MarketplaceWallet, OrderbookKind } from '../../../../types';
import type {
	MarketCollection,
	Marketplace,
} from '../../../../types/new-marketplace-types';
import { NewMarketplaceType } from '../../../../types/new-marketplace-types';
import { createWagmiConfig } from '../create-config';

describe('createWagmiConfig', () => {
	let baseMarketplace: Marketplace;
	let baseSdkConfig: SdkConfig;

	beforeEach(() => {
		baseMarketplace = {
			projectId: 1,
			settings: {
				publisherId: 'test-publisher',
				title: 'Test Marketplace',
				socials: {
					twitter: '',
					discord: '',
					website: '',
					tiktok: '',
					instagram: '',
					youtube: '',
				},
				faviconUrl: 'https://test.com/favicon.ico',
				walletOptions: {
					walletType: MarketplaceWallet.UNIVERSAL,
					oidcIssuers: {},
					connectors: [],
					includeEIP6963Wallets: false,
				},
				logoUrl: '',
				fontUrl: '',
				accessKey: undefined,
			},
			market: {
				enabled: true,
				title: 'Market Page',
				bannerUrl: 'https://test.com/banner.jpg',
				ogImage: '',
				collections: [
					{
						marketplaceType: NewMarketplaceType.MARKET,
						isLAOSERC721: undefined,
						chainId: polygon.id,
						bannerUrl: '',
						itemsAddress: '0x1234567890123456789012345678901234567890',
						filterSettings: {
							filterOrder: [],
							exclusions: [],
						},
						feePercentage: 0,
						destinationMarketplace: OrderbookKind.sequence_marketplace_v2,
						currencyOptions: [],
					} as MarketCollection,
				],
			},
			shop: {
				enabled: false,
				title: 'Shop Page',
				bannerUrl: '',
				ogImage: '',
				collections: [],
			},
		};

		baseSdkConfig = {
			projectAccessKey: 'test-access-key',
			projectId: '1',
		};
	});

	describe('successful cases', () => {
		it('should create config with empty collections', () => {
			const configWithEmptyCollections = createWagmiConfig(
				{
					...baseMarketplace,
					market: { ...baseMarketplace.market, collections: [] },
					shop: { ...baseMarketplace.shop, collections: [] },
				},
				baseSdkConfig,
			);
			expect(configWithEmptyCollections.chains).toBeDefined();
			expect(Array.isArray(configWithEmptyCollections.chains)).toBe(true);
			expect(configWithEmptyCollections.chains).toHaveLength(1);
			// Default chain is polygon if no collections are specified
			expect(configWithEmptyCollections.chains[0].id).toBe(polygon.id);
		});

		it('should create config with universal wallet setup', () => {
			const marketplaceConfig: Marketplace = {
				...baseMarketplace,
				settings: {
					...baseMarketplace.settings,
					walletOptions: {
						connectors: ['walletconnect', 'coinbase'],
						includeEIP6963Wallets: true,
						walletType: MarketplaceWallet.UNIVERSAL,
						oidcIssuers: {},
					},
				},
			};

			const sdkConfig: SdkConfig = {
				...baseSdkConfig,
				walletConnectProjectId: 'test-wc-project-id',
			};

			const config = createWagmiConfig(marketplaceConfig, sdkConfig);
			expect(config.connectors).toBeDefined();
			expect(config.chains).toHaveLength(1);
		});

		it('should create config with embedded wallet setup', () => {
			const waasTenantKey = 'test-waas-tenant-key';

			const marketplaceConfig: Marketplace = {
				...baseMarketplace,
				settings: {
					...baseMarketplace.settings,
					walletOptions: {
						connectors: ['walletconnect'],
						includeEIP6963Wallets: false,
						walletType: MarketplaceWallet.EMBEDDED,
						oidcIssuers: {},
						embedded: {
							tenantKey: waasTenantKey,
							emailEnabled: false,
							providers: [],
						},
					},
				},
			};

			const sdkConfig: SdkConfig = {
				...baseSdkConfig,
				walletConnectProjectId: 'test-wc-project-id',
			};

			const config = createWagmiConfig(marketplaceConfig, sdkConfig);
			expect(config.connectors).toBeDefined();
			expect(config.chains).toHaveLength(1);
		});

		it('should respect EIP6963 wallet inclusion setting', () => {
			const marketplaceConfig: Marketplace = {
				...baseMarketplace,
				settings: {
					...baseMarketplace.settings,
					walletOptions: {
						connectors: ['walletconnect'],
						includeEIP6963Wallets: false,
						walletType: MarketplaceWallet.UNIVERSAL,
						oidcIssuers: {},
					},
				},
			};

			const config = createWagmiConfig(marketplaceConfig, baseSdkConfig);
			expect(config.connectors).toBeDefined();
			expect(config.chains).toHaveLength(1);
		});

		it('should create SSR compatible config when ssr flag is true', async () => {
			const config = createWagmiConfig(
				baseMarketplace,
				baseSdkConfig,
				true,
			) as Config;

			expect(config.storage).toBeInstanceOf(cookieStorage.constructor);

			const testKey = 'wagmi.test';
			const testValue = { data: 'test-value' };

			config.storage?.setItem(testKey, JSON.stringify(testValue));

			const storedValue = await config.storage?.getItem(testKey);
			expect(storedValue).toBeDefined();
			expect(JSON.parse(storedValue as string)).toEqual(testValue);
		});
	});

	describe('failure cases', () => {
		it('should still create config when walletConnectProjectId is missing', () => {
			const marketplaceConfig: Marketplace = {
				...baseMarketplace,
				settings: {
					...baseMarketplace.settings,
					walletOptions: {
						connectors: ['walletconnect'],
						includeEIP6963Wallets: true,
						walletType: MarketplaceWallet.UNIVERSAL,
						oidcIssuers: {},
					},
				},
			};

			const config = createWagmiConfig(marketplaceConfig, baseSdkConfig);
			expect(config.connectors).toBeDefined();
			expect(config.chains).toHaveLength(1);
		});
	});
});
