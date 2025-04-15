import {
	type SequenceOptions,
	type Wallet,
	apple,
	appleWaas,
	coinbaseWallet,
	ecosystemWallet,
	email,
	emailWaas,
	facebook,
	getConnectWallets,
	google,
	googleWaas,
	sequence,
	twitch,
	walletConnect,
} from '@0xsequence/connect';
import React, { type FunctionComponent } from 'react';
import type { CreateConnectorFn } from 'wagmi';
import {
	type Env,
	type MarketplaceConfig,
	MarketplaceWallet,
	type SdkConfig,
} from '../../../types';
import { MissingConfigError } from '../../../utils/_internal/error/transaction';
import { DEFAULT_NETWORK } from '../consts';

export function getConnectors({
	marketplaceConfig,
	sdkConfig,
	walletType,
}: {
	marketplaceConfig: MarketplaceConfig;
	sdkConfig: SdkConfig;
	walletType: MarketplaceWallet;
}): CreateConnectorFn[] {
	const connectors = commonConnectors(marketplaceConfig, sdkConfig);

	if (walletType === MarketplaceWallet.UNIVERSAL) {
		connectors.push(...getUniversalWalletConfigs(sdkConfig, marketplaceConfig));
	} else if (walletType === MarketplaceWallet.EMBEDDED) {
		connectors.push(...getWaasConnectors(sdkConfig));
	} else if (walletType === MarketplaceWallet.ECOSYSTEM) {
		connectors.push(getEcosystemConnector(marketplaceConfig, sdkConfig));
	} else {
		throw new Error('Invalid wallet type');
	}

	return getConnectWallets(sdkConfig.projectAccessKey, connectors);
}

function commonConnectors(
	marketplaceConfig: MarketplaceConfig,
	sdkConfig: SdkConfig,
) {
	const wallets = [];
	const { title: appName } = marketplaceConfig;
	const walletOptions = marketplaceConfig.walletOptions;
	const walletConnectProjectId = sdkConfig.wallet?.walletConnectProjectId;

	if (walletOptions.connectors.includes('coinbase')) {
		wallets.push(
			coinbaseWallet({
				appName,
			}),
		);
	}

	if (
		walletConnectProjectId &&
		walletOptions.connectors.includes('walletconnect')
	) {
		wallets.push(
			walletConnect({
				projectId: walletConnectProjectId,
			}),
		);
	}

	return wallets;
}

function getUniversalWalletConfigs(
	config: SdkConfig,
	marketplaceConfig: MarketplaceConfig,
): Wallet[] {
	const { projectAccessKey } = config;
	const sequenceWalletEnv = config._internal?.sequenceWalletEnv || 'production';

	const sequenceWalletOptions = {
		walletAppURL: getSequenceWalletURL(sequenceWalletEnv),
		defaultNetwork: DEFAULT_NETWORK,
		connect: {
			projectAccessKey,
			app: marketplaceConfig.title,
			settings: {
				bannerUrl: marketplaceConfig.ogImage,
			},
		},
	} satisfies SequenceOptions;

	return [
		sequence(sequenceWalletOptions),
		email(sequenceWalletOptions),
		facebook(sequenceWalletOptions),
		google(sequenceWalletOptions),
		apple(sequenceWalletOptions),
		twitch(sequenceWalletOptions),
	] as const;
}

export function getWaasConnectors(sdkConfig: SdkConfig): Wallet[] {
	const { projectAccessKey } = sdkConfig;

	const waasConfigKey = sdkConfig.wallet?.embedded?.waasConfigKey;

	if (!waasConfigKey) throw new MissingConfigError('waasConfigKey');

	const { googleClientId, appleClientId, appleRedirectURI } =
		sdkConfig.wallet?.embedded || {};

	const wallets: Wallet[] = [
		emailWaas({
			projectAccessKey,
			waasConfigKey,
			network: DEFAULT_NETWORK,
		}),
	];

	if (googleClientId) {
		wallets.push(
			googleWaas({
				projectAccessKey,
				googleClientId,
				waasConfigKey,
				network: DEFAULT_NETWORK,
			}),
		);
	}

	if (appleClientId) {
		wallets.push(
			appleWaas({
				projectAccessKey,
				appleClientId,
				appleRedirectURI,
				waasConfigKey,
				network: DEFAULT_NETWORK,
			}),
		);
	}

	return wallets;
}

export function getEcosystemConnector(
	marketplaceConfig: MarketplaceConfig,
	sdkConfig: SdkConfig,
): Wallet {
	const ecosystemOptions = marketplaceConfig.walletOptions.ecosystem;
	if (!ecosystemOptions) throw new MissingConfigError('ecosystem');
	const { walletAppName, walletUrl, logoDarkUrl, logoLightUrl } =
		ecosystemOptions;

	return ecosystemWallet({
		projectAccessKey: sdkConfig.projectAccessKey,
		walletUrl,
		name: walletAppName,
		defaultNetwork: DEFAULT_NETWORK,
		logoDark: getEcosystemLogo(logoDarkUrl, walletAppName),
		logoLight: getEcosystemLogo(logoLightUrl, walletAppName),
	});
}

function getEcosystemLogo(
	url: string | undefined,
	name: string,
): FunctionComponent {
	if (!url) return () => null;
	const Logo = () =>
		React.createElement('img', { src: url, alt: name, width: 32, height: 32 });
	Logo.displayName = 'EcosystemLogo';
	return Logo;
}

function getSequenceWalletURL(env: Env) {
	switch (env) {
		case 'development':
			return 'https://dev.sequence.app';
		case 'production':
			return 'https://sequence.app';
		case 'next':
			return 'https://next.sequence.app';
	}
}
