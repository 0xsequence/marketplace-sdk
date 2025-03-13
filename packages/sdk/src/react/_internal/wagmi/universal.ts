import {
	type SequenceOptions,
	type Wallet,
	apple,
	coinbaseWallet,
	email,
	facebook,
	getConnectWallets,
	google,
	sequence,
	twitch,
	walletConnect,
} from '@0xsequence/react-connect';
import type { CreateConnectorFn } from 'wagmi';
import type { MarketplaceConfig, SdkConfig } from '../../../types';
import { DEFAULT_NETWORK } from '../consts';

const defaultNetwork = DEFAULT_NETWORK;

export function getUniversalConnectors(
	marketplaceConfig: MarketplaceConfig,
	config: SdkConfig,
): CreateConnectorFn[] {
	const { projectAccessKey } = config;
	const sequenceWalletOptions = {
		defaultNetwork,
		connect: {
			projectAccessKey,
			app: marketplaceConfig.title,
			settings: {
				bannerUrl: marketplaceConfig.ogImage,
			},
		},
	};
	const wallets = getWalletConfigs(
		marketplaceConfig,
		sequenceWalletOptions,
		config.wallet?.walletConnectProjectId,
	);
	const socialWallets = getSocialWalletConfigs(sequenceWalletOptions);
	return getConnectWallets(projectAccessKey, [...socialWallets, ...wallets]);
}

function getWalletConfigs(
	marketplaceConfig: MarketplaceConfig,
	sequenceWalletOptions: SequenceOptions,
	walletConnectProjectId?: string,
): Wallet[] {
	const wallets: Wallet[] = [];

	const walletOptions = marketplaceConfig.walletOptions;

	wallets.push(sequence(sequenceWalletOptions));

	if (walletOptions.connectors.includes('coinbase')) {
		wallets.push(coinbaseWallet({ appName: marketplaceConfig.title }));
	}

	if (
		walletConnectProjectId &&
		walletOptions.connectors.includes('walletconnect')
	) {
		wallets.push(walletConnect({ projectId: walletConnectProjectId }));
	}

	return wallets;
}

function getSocialWalletConfigs(
	sequenceWalletOptions: SequenceOptions,
): Wallet[] {
	return [
		email(sequenceWalletOptions),
		facebook(sequenceWalletOptions),
		google(sequenceWalletOptions),
		apple(sequenceWalletOptions),
		twitch(sequenceWalletOptions),
	] as const;
}
