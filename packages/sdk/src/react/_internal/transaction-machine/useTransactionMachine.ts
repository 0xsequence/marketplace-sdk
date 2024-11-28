import { useSelectPaymentModal } from '@0xsequence/kit-checkout';
import type { Hash } from 'viem';
import { useWalletClient } from 'wagmi';
import { getPublicRpcClient } from '../../../utils';
import { useConfig, useMarketplaceConfig } from '../../hooks';
import { useSwitchChainModal } from '../../ui/modals/_internal/components/switchChainModal';
import {
	type TransactionConfig,
	TransactionMachine,
} from './execute-transaction';

export const useTransactionMachine = (
	config: Omit<TransactionConfig, 'sdkConfig' | 'marketplaceConfig'>,
	onSuccess?: (hash: Hash) => void,
	onError?: (error: Error) => void,
) => {
	const { data: walletClient } = useWalletClient();
	const { show: showSwitchChainModal } = useSwitchChainModal();
	const sdkConfig = useConfig();
	const { data: marketplaceConfig, error: marketplaceError } =
		useMarketplaceConfig();
	const { openSelectPaymentModal } = useSelectPaymentModal();

	if (marketplaceError) {
		throw marketplaceError; //TODO: Add error handling
	}

	if (!walletClient || !marketplaceConfig) return null;

	return new TransactionMachine(
		{ config: { sdkConfig, marketplaceConfig, ...config }, onSuccess, onError },
		walletClient,
		getPublicRpcClient(config.chainId),
		openSelectPaymentModal,
		async (chainId) => {
			return new Promise<void>((resolve, reject) => {
				showSwitchChainModal({
					chainIdToSwitchTo: Number(chainId),
					onSwitchChain: () => {
						resolve();
					},
					callbacks: {
						onUserRejectedRequest: () =>
							reject(new Error('User rejected chain switch')),
					},
				});
			});
		},
	);
};
