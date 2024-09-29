import {
	appleWaas,
	coinbaseWallet,
	emailWaas,
	getKitConnectWallets,
	googleWaas,
	type Wallet,
	walletConnect,
} from '@0xsequence/kit';
import { type CreateConnectorFn } from 'wagmi';
import { MarketplaceConfig, SdkConfig } from '../../../types';
import { DEFAULT_NETWORK } from '../consts';

export function getWaasConnectors(
	marketplaceConfig: MarketplaceConfig,
	sdkConfig: SdkConfig,
): CreateConnectorFn[] {
	const { projectAccessKey } = sdkConfig;

	const waasConfigKey = sdkConfig.wallet?.embedded?.waasConfigKey;

	if (!waasConfigKey)
		throw new Error('waasConfigKey is required for embedded wallet');

	const walletConnectProjectId = sdkConfig.wallet?.walletConnectProjectId;
	const { googleClientId, appleClientId, appleRedirectURI } =
		sdkConfig.wallet?.embedded || {};

	const { title: appName } = marketplaceConfig;

	const wallets: Wallet[] = [
		emailWaas({
			projectAccessKey,
			waasConfigKey,
			network: DEFAULT_NETWORK,
		}),

		coinbaseWallet({
			appName,
		}),
	];

	if (walletConnectProjectId) {
		wallets.push(
			walletConnect({
				projectId: walletConnectProjectId,
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

	return getKitConnectWallets(projectAccessKey, wallets);
}
