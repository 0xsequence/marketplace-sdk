import {
	type SequenceOptions,
	type Wallet,
	apple,
	coinbaseWallet,
	email,
	facebook,
	getKitConnectWallets,
	google,
	sequence,
	twitch,
	walletConnect,
} from '@0xsequence/kit';
import type { MarketplaceConfig, SdkConfig } from '@types';
import { DEFAULT_NETWORK } from '../consts';

const defaultNetwork = DEFAULT_NETWORK;

export function getUniversalConnectors(
	marketplaceConfig: MarketplaceConfig,
	config: SdkConfig,
) {
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
	return getKitConnectWallets(projectAccessKey, [...socialWallets, ...wallets]);
}

function getWalletConfigs(
	marketplaceConfig: MarketplaceConfig,
	sequenceWalletOptions: SequenceOptions,
	walletConnectProjectId?: string,
): Wallet[] {
	const wallets: Wallet[] = [];

	wallets.push(sequence(sequenceWalletOptions));

	wallets.push(coinbaseWallet({ appName: marketplaceConfig.title }));

	if (walletConnectProjectId)
		wallets.push(walletConnect({ projectId: walletConnectProjectId }));

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
