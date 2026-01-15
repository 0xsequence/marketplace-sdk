import type { MarketplaceConfig, SdkConfig } from '@0xsequence/marketplace-sdk';
import { getWagmiChainsAndTransports } from '@0xsequence/marketplace-sdk/react';
import { createConfig } from 'wagmi';
import { injected, mock } from 'wagmi/connectors';

const TEST_ACCOUNTS = [
	'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
	'0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
	'0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
] as const;

export function createHeadlessWagmiConfig(
	marketplaceConfig: MarketplaceConfig,
	sdkConfig: SdkConfig,
) {
	const { chains, transports } = getWagmiChainsAndTransports({
		marketplaceConfig,
		sdkConfig,
	});

	return createConfig({
		chains,
		transports,
		connectors: [
			mock({
				accounts: [...TEST_ACCOUNTS],
				features: {
					reconnect: true,
				},
			}),
			injected(),
		],
		multiInjectedProviderDiscovery: true,
	});
}
