import { type MarketplaceConfig } from '~/marketplace-sdk/react/hooks/useMarketplaceConfig';
import { type Config } from '~/marketplace-sdk/react/types/config';

import { DEFAULT_NETWORK } from '../../consts';
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

const defaultNetwork = DEFAULT_NETWORK;

export function getWaasConnectors(
	marketplaceConfig: MarketplaceConfig,
	sdkConfig: Config,
): CreateConnectorFn[] {
	const { projectAccessKey } = sdkConfig;

	const waasConfigKey = sdkConfig.wallet?.embedded?.waasConfigKey;

	if (!waasConfigKey)
		throw new Error('waasConfigKey is required for embedded wallet');

	const {
		walletConnectProjectId,
		googleClientId,
		appleClientId,
		appleRedirectURI,
	} = sdkConfig.wallet?.embedded || {};

	const { title: appName } = marketplaceConfig;

	const wallets: Wallet[] = [
		emailWaas({
			projectAccessKey,
			waasConfigKey,
			network: defaultNetwork,
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
				network: defaultNetwork,
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
				network: defaultNetwork,
			}),
		);
	}

	return getKitConnectWallets(projectAccessKey, wallets);
}
