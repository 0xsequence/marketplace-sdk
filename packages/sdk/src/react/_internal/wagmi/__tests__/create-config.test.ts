import { describe, it, expect, beforeEach } from 'vitest';
import { createWagmiConfig } from '../create-config';
import { getWaasConnectors } from '../embedded';
import {
	MarketplaceType,
	MarketplaceWallet,
	OrderbookKind,
	type MarketplaceConfig,
	type SdkConfig,
} from '../../../../types';
import { polygon } from 'viem/chains';
import { MissingConfigError } from '../../../../utils/_internal/error/transaction';
import { cookieStorage, type Config } from 'wagmi';

describe('createWagmiConfig', () => {
	let baseMarketplaceConfig: MarketplaceConfig;
	let baseSdkConfig: SdkConfig;

	beforeEach(() => {
		baseMarketplaceConfig = {
			cssString: '',
			manifestUrl: '',
			publisherId: 'test-publisher',
			title: 'Test Marketplace',
			shortDescription: 'Test Description',
			socials: {
				twitter: '',
				discord: '',
				website: '',
				tiktok: '',
				instagram: '',
				youtube: '',
			},
			faviconUrl: 'https://test.com/favicon.ico',
			landingBannerUrl: 'https://test.com/banner.jpg',
			walletOptions: {
				walletType: MarketplaceWallet.UNIVERSAL,
				oidcIssuers: {},
				connectors: [],
				includeEIP6963Wallets: false,
			},
			collections: [
				{
					address: '0x1234567890123456789012345678901234567890',
					chainId: polygon.id,
					marketplaceType: MarketplaceType.ORDERBOOK,
					currencyOptions: [],
					destinationMarketplace: OrderbookKind.sequence_marketplace_v2,
					filterSettings: {
						filterOrder: [],
						exclusions: [],
					},
					exchanges: [],
					bannerUrl: '',
					feePercentage: 0,
				},
			],
			landingPageLayout: 'default',
			logoUrl: '',
			bannerUrl: '',
			fontUrl: '',
			ogImage: '',
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
					...baseMarketplaceConfig,
					collections: [],
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
			const marketplaceConfig: MarketplaceConfig = {
				...baseMarketplaceConfig,
				walletOptions: {
					connectors: ['walletconnect', 'coinbase'],
					includeEIP6963Wallets: true,
					walletType: MarketplaceWallet.UNIVERSAL,
					oidcIssuers: {},
				},
			};

			const sdkConfig: SdkConfig = {
				...baseSdkConfig,
				wallet: {
					walletConnectProjectId: 'test-wc-project-id',
				},
			};

			const config = createWagmiConfig(marketplaceConfig, sdkConfig);
			expect(config.connectors).toBeDefined();
			expect(config.chains).toHaveLength(1);
		});

		it('should create config with embedded wallet setup', () => {
			const marketplaceConfig: MarketplaceConfig = {
				...baseMarketplaceConfig,
				walletOptions: {
					connectors: ['walletconnect'],
					includeEIP6963Wallets: false,
					walletType: MarketplaceWallet.EMBEDDED,
					oidcIssuers: {},
				},
			};

			const sdkConfig: SdkConfig = {
				...baseSdkConfig,
				wallet: {
					embedded: {
						waasConfigKey:
							'eyJwcm9qZWN0SWQiOjEzNjM5LCJycGNTZXJ2ZXIiOiJodHRwczovL3dhYXMuc2VxdWVuY2UuYXBwIn0',
						googleClientId: 'test-google-id',
						appleClientId: 'test-apple-id',
						appleRedirectURI: 'https://test.com/redirect',
					},
				},
			};

			const config = createWagmiConfig(marketplaceConfig, sdkConfig);
			expect(config.connectors).toBeDefined();
			expect(config.chains).toHaveLength(1);
		});

		it('should respect EIP6963 wallet inclusion setting', () => {
			const marketplaceConfig: MarketplaceConfig = {
				...baseMarketplaceConfig,
				walletOptions: {
					connectors: ['walletconnect'],
					includeEIP6963Wallets: false,
					walletType: MarketplaceWallet.UNIVERSAL,
					oidcIssuers: {},
				},
			};

			const config = createWagmiConfig(marketplaceConfig, baseSdkConfig);
			expect(config.connectors).toBeDefined();
			expect(config.chains).toHaveLength(1);
		});

		it('should create SSR compatible config when ssr flag is true', async () => {
			const config = createWagmiConfig(
				baseMarketplaceConfig,
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
		it('should throw error when trying to use embedded wallet without waasConfigKey', () => {
			const marketplaceConfig: MarketplaceConfig = {
				...baseMarketplaceConfig,
				walletOptions: {
					connectors: ['walletconnect'],
					includeEIP6963Wallets: false,
					walletType: MarketplaceWallet.EMBEDDED,
					oidcIssuers: {},
				},
			};

			const sdkConfig: SdkConfig = {
				...baseSdkConfig,
				wallet: {
					embedded: {
						waasConfigKey: '',
						googleClientId: 'test-google-id',
						appleClientId: 'test-apple-id',
						appleRedirectURI: 'https://test.com/redirect',
					},
				},
			};

			expect(() =>
				getWaasConnectors(marketplaceConfig, {
					...sdkConfig,
					wallet: {
						...sdkConfig.wallet,
						embedded: {
							...sdkConfig.wallet?.embedded,
							waasConfigKey: '', // Empty waasConfigKey should trigger the error
						},
					},
				}),
			).toThrow(MissingConfigError);
		});

		it('should still create config when walletConnectProjectId is missing', () => {
			const marketplaceConfig: MarketplaceConfig = {
				...baseMarketplaceConfig,
				walletOptions: {
					connectors: ['walletconnect'],
					includeEIP6963Wallets: true,
					walletType: MarketplaceWallet.UNIVERSAL,
					oidcIssuers: {},
				},
			};

			const config = createWagmiConfig(marketplaceConfig, baseSdkConfig);
			expect(config.connectors).toBeDefined();
			expect(config.chains).toHaveLength(1);
		});
	});
});
