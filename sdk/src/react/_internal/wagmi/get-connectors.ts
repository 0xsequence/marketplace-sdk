import { MarketplaceWalletType } from '@0xsequence/api-client';
import {
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
	metaMask,
	type SequenceOptions,
	sequence,
	twitch,
	type Wallet,
	walletConnect,
} from '@0xsequence/connect';
import React, { type FunctionComponent } from 'react';
import type { CreateConnectorFn } from 'wagmi';
import type { Env, MarketplaceConfig, SdkConfig } from '../../../types';
import { MissingConfigError } from '../../../utils/_internal/error/transaction';
import { DEFAULT_NETWORK } from '../consts';

export function getConnectors({
	marketplaceConfig,
	sdkConfig,
	walletType,
	ssr,
}: {
	marketplaceConfig: MarketplaceConfig;
	sdkConfig: SdkConfig;
	walletType: MarketplaceWalletType;
	ssr?: boolean;
}): CreateConnectorFn[] {
	const connectors = commonConnectors(marketplaceConfig, sdkConfig, ssr);

	if (walletType === MarketplaceWalletType.UNIVERSAL) {
		connectors.push(...getUniversalWalletConfigs(sdkConfig, marketplaceConfig));
	} else if (walletType === MarketplaceWalletType.EMBEDDED) {
		connectors.push(...getWaasConnectors(sdkConfig, marketplaceConfig));
	} else if (walletType === MarketplaceWalletType.ECOSYSTEM) {
		connectors.push(getEcosystemConnector(marketplaceConfig, sdkConfig));
	} else {
		throw new Error('Invalid wallet type');
	}

	return getConnectWallets(sdkConfig.projectAccessKey, connectors);
}

function commonConnectors(
	marketplaceConfig: MarketplaceConfig,
	sdkConfig: SdkConfig,
	ssr?: boolean,
): Wallet[] {
	const wallets: Wallet[] = [];
	const { title: appName } = marketplaceConfig.settings;
	const walletOptions = marketplaceConfig.settings.walletOptions;
	const walletConnectProjectId = sdkConfig.walletConnectProjectId;

	if (walletOptions.connectors.includes('coinbase')) {
		wallets.push(
			coinbaseWallet({
				appName,
			}),
		);
	}

	const isBrowser = typeof window !== 'undefined';
	if (
		walletConnectProjectId &&
		walletOptions.connectors.includes('walletconnect') &&
		isBrowser
	) {
		wallets.push(
			walletConnect({
				projectId: walletConnectProjectId,
			}),
		);
	}

	if (walletOptions.connectors.includes('metamask')) {
		wallets.push(
			metaMask({
				dappMetadata: {
					name: appName,
				},
			}),
		);
	}

	return wallets;
}

function getUniversalWalletConfigs(
	config: SdkConfig,
	marketplaceConfig: MarketplaceConfig,
): Wallet[] {
	const sequenceWalletOverrides =
		config._internal?.overrides?.api?.sequenceWallet;
	const sequenceWalletUrl =
		sequenceWalletOverrides?.url ||
		getSequenceWalletURL(sequenceWalletOverrides?.env || 'production');
	const projectAccessKey =
		sequenceWalletOverrides?.accessKey || config.projectAccessKey;

	const sequenceWalletOptions = {
		walletAppURL: sequenceWalletUrl,
		defaultNetwork: DEFAULT_NETWORK,
		connect: {
			projectAccessKey,
			app: marketplaceConfig.settings.title,
			settings: {
				// TODO: make a separate config for this?
				bannerUrl: marketplaceConfig.market.ogImage,
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

export function getWaasConnectors(
	config: SdkConfig,
	marketplaceConfig: MarketplaceConfig,
): Wallet[] {
	const { projectAccessKey } = config;

	const waasConfigKey =
		marketplaceConfig.settings.walletOptions.embedded?.tenantKey;

	if (!waasConfigKey)
		throw new MissingConfigError(
			'Embedded wallet config is missing, please check your access key',
		);

	const waasOptions = marketplaceConfig.settings.walletOptions.oidcIssuers;
	const googleClientId = waasOptions.google;
	const appleClientId = waasOptions.apple;
	const appleRedirectURI =
		typeof window !== 'undefined'
			? `${window.location.origin}${window.location.pathname}`
			: undefined;

	const wallets: Wallet[] = [];

	if (marketplaceConfig.settings.walletOptions.embedded?.emailEnabled) {
		wallets.push(
			emailWaas({
				projectAccessKey,
				waasConfigKey,
			}),
		);
	}

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
	const ecosystemOptions = marketplaceConfig.settings.walletOptions.ecosystem;
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
		case 'next':
			return 'https://next.sequence.app';
		// biome-ignore lint/complexity/noUselessSwitchCase: Production case kept for readability alongside other environments
		case 'production':
		default:
			return 'https://sequence.app';
	}
}
