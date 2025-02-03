import { describe, it, expect, beforeEach } from 'vitest';
import { createWagmiConfig } from '../create-config';
import { getWaasConnectors } from '../embedded';
import type { MarketplaceConfig, SdkConfig } from '../../../../types';
import { WalletOptions } from '../../../../types';
import { polygon } from 'viem/chains';
import { MissingConfigError } from '../../../../utils/_internal/error/transaction';
import { cookieStorage, type Config } from 'wagmi';

describe('createWagmiConfig', () => {
	let baseMarketplaceConfig: MarketplaceConfig;
	let baseSdkConfig: SdkConfig;

	beforeEach(() => {
		baseMarketplaceConfig = {
			projectId: 1,
			publisherId: 'test-publisher',
			title: 'Test Marketplace',
			shortDescription: 'Test Description',
			faviconUrl: 'https://test.com/favicon.ico',
			landingBannerUrl: 'https://test.com/banner.jpg',
			titleTemplate: '%s | Test',
			walletOptions: [WalletOptions.Sequence],
			collections: [
				{
					collectionAddress: '0x1234567890123456789012345678901234567890',
					chainId: polygon.id,
					marketplaceFeePercentage: 2.5,
					marketplaceType: 'orderbook',
				},
			],
			landingPageLayout: 'default',
			cssString: '',
			manifestUrl: 'https://test.com/manifest.json',
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
				walletOptionsNew: {
					connectors: ['walletconnect', 'coinbase'],
					includeEIP6963Wallets: true,
					walletType: 'universal',
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
				walletOptionsNew: {
					connectors: ['walletconnect'],
					includeEIP6963Wallets: false,
					walletType: 'embedded',
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
				walletOptionsNew: {
					connectors: ['walletconnect'],
					includeEIP6963Wallets: false,
					walletType: 'universal',
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
				walletOptionsNew: {
					connectors: ['walletconnect'],
					includeEIP6963Wallets: false,
					walletType: 'embedded',
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
				walletOptionsNew: {
					connectors: ['walletconnect'],
					includeEIP6963Wallets: true,
					walletType: 'universal',
				},
			};

			const config = createWagmiConfig(marketplaceConfig, baseSdkConfig);
			expect(config.connectors).toBeDefined();
			expect(config.chains).toHaveLength(1);
		});

		it('should still create config when projectAccessKey is empty', () => {
			const sdkConfig: SdkConfig = {
				...baseSdkConfig,
				projectAccessKey: '', // Empty project access key
			};

			const config = createWagmiConfig(baseMarketplaceConfig, sdkConfig);
			expect(config.chains).toHaveLength(1);
		});
	});
});
