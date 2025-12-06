import {
	ContractType,
	MarketplaceWalletType,
	OrderbookKind,
} from '@0xsequence/api-client';
import { allNetworks } from '@0xsequence/network';
import { polygon } from 'viem/chains';
import { beforeEach, describe, expect, it } from 'vitest';
import { type Config, cookieStorage } from 'wagmi';
import type {
	MarketCollection,
	MarketplaceConfig,
	SdkConfig,
} from '../../../../types';
import { createWagmiConfig } from '../create-config';

describe('createWagmiConfig', () => {
	let baseMarketplace: MarketplaceConfig;
	let baseSdkConfig: SdkConfig;
	const expectedNetworkCount = Object.keys(allNetworks).length;

	beforeEach(() => {
		baseMarketplace = {
			projectId: 1,
			settings: {
				style: {},
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
					walletType: MarketplaceWalletType.UNIVERSAL,
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
				bannerUrl: 'https://test.com/banner.jpg',
				ogImage: '',
				private: false,
				collections: [
					{
						id: 1,
						projectId: 12345,
						marketplaceCollectionType: 'market',
						contractType: ContractType.ERC721,
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
						private: false,
					} as MarketCollection,
				],
			},
			shop: {
				enabled: false,
				bannerUrl: '',
				ogImage: '',
				collections: [],
				private: false,
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
			expect(configWithEmptyCollections.chains).toHaveLength(
				expectedNetworkCount,
			);
			// All networks from allNetworks are now included
			expect(
				configWithEmptyCollections.chains.find(
					(chain) => chain.id === polygon.id,
				),
			).toBeDefined();
		});

		it('should create config with universal wallet setup', () => {
			const marketplaceConfig: MarketplaceConfig = {
				...baseMarketplace,
				settings: {
					...baseMarketplace.settings,
					walletOptions: {
						connectors: ['walletconnect', 'coinbase'],
						includeEIP6963Wallets: true,
						walletType: MarketplaceWalletType.UNIVERSAL,
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
			expect(config.chains).toHaveLength(expectedNetworkCount);
		});

		it('should create config with embedded wallet setup', () => {
			const waasTenantKey = 'test-waas-tenant-key';

			const marketplaceConfig: MarketplaceConfig = {
				...baseMarketplace,
				settings: {
					...baseMarketplace.settings,
					walletOptions: {
						connectors: ['walletconnect'],
						includeEIP6963Wallets: false,
						walletType: MarketplaceWalletType.EMBEDDED,
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
			expect(config.chains).toHaveLength(expectedNetworkCount);
		});

		it('should respect EIP6963 wallet inclusion setting', () => {
			const marketplaceConfig: MarketplaceConfig = {
				...baseMarketplace,
				settings: {
					...baseMarketplace.settings,
					walletOptions: {
						connectors: ['walletconnect'],
						includeEIP6963Wallets: false,
						walletType: MarketplaceWalletType.UNIVERSAL,
						oidcIssuers: {},
					},
				},
			};

			const config = createWagmiConfig(marketplaceConfig, baseSdkConfig);
			expect(config.connectors).toBeDefined();
			expect(config.chains).toHaveLength(expectedNetworkCount);
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
			const marketplaceConfig: MarketplaceConfig = {
				...baseMarketplace,
				settings: {
					...baseMarketplace.settings,
					walletOptions: {
						connectors: ['walletconnect'],
						includeEIP6963Wallets: true,
						walletType: MarketplaceWalletType.UNIVERSAL,
						oidcIssuers: {},
					},
				},
			};

			const config = createWagmiConfig(marketplaceConfig, baseSdkConfig);
			expect(config.connectors).toBeDefined();
			expect(config.chains).toHaveLength(expectedNetworkCount);
		});
	});
});
