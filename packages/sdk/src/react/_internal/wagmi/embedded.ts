import {
	type Wallet,
	appleWaas,
	coinbaseWallet,
	emailWaas,
	getKitConnectWallets,
	googleWaas,
	walletConnect,
} from '@0xsequence/kit';
import type { CreateConnectorFn } from 'wagmi';
import type { MarketplaceConfig, SdkConfig } from '../../../types';
import { MissingConfigError } from '../../../utils/_internal/error/transaction';
import { DEFAULT_NETWORK } from '../consts';

export function getWaasConnectors(
	marketplaceConfig: MarketplaceConfig,
	sdkConfig: SdkConfig,
): CreateConnectorFn[] {
	const { projectAccessKey } = sdkConfig;

	const waasConfigKey = sdkConfig.wallet?.embedded?.waasConfigKey;

	if (!waasConfigKey) throw new MissingConfigError('waasConfigKey');

	const walletConnectProjectId = sdkConfig.wallet?.walletConnectProjectId;
	const { googleClientId, appleClientId, appleRedirectURI } =
		sdkConfig.wallet?.embedded || {};

	const { title: appName } = marketplaceConfig;

	const walletOptions = marketplaceConfig.walletOptions;

	const wallets: Wallet[] = [
		emailWaas({
			projectAccessKey,
			waasConfigKey,
			network: DEFAULT_NETWORK,
		}),
	];

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
