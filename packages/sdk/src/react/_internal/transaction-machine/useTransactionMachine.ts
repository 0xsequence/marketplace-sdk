import { useSelectPaymentModal } from '@0xsequence/kit-checkout';
import type { Hash } from 'viem';
import { useAccount, useSwitchChain, useWalletClient } from 'wagmi';
import { getPublicRpcClient } from '../../../utils';
import { useConfig, useMarketplaceConfig } from '../../hooks';
import { useSwitchChainModal } from '../../ui/modals/_internal/components/switchChainModal';
import { WalletKind } from '../api';
import {
	type TransactionConfig,
	TransactionMachine,
} from './execute-transaction';

export type UseTransactionMachineConfig = Omit<
	TransactionConfig,
	'sdkConfig' | 'marketplaceConfig' | 'walletKind' | 'chains'
>;

export const useTransactionMachine = (
	config: UseTransactionMachineConfig,
	onSuccess?: (hash: Hash) => void,
	onError?: (error: Error) => void,
	closeActionModal?: () => void,
	onTransactionSent?: (hash: Hash) => void,
) => {
	const { data: walletClient } = useWalletClient();
	const { show: showSwitchChainModal } = useSwitchChainModal();
	const sdkConfig = useConfig();
	const { data: marketplaceConfig, error: marketplaceError } =
		useMarketplaceConfig();
	const { openSelectPaymentModal } = useSelectPaymentModal();
	const { chains } = useSwitchChain();

	const { connector, chainId: accountChainId } = useAccount();
	const walletKind =
		connector?.id === 'sequence' ? WalletKind.sequence : WalletKind.unknown;

	if (marketplaceError) {
		throw marketplaceError; //TODO: Add error handling
	}

	if (!walletClient || !marketplaceConfig || !accountChainId) return null;

	return new TransactionMachine(
		{
			config: { sdkConfig, marketplaceConfig, walletKind, chains, ...config },
			onSuccess,
			onError,
			onTransactionSent,
		},
		walletClient,
		getPublicRpcClient(config.chainId),
		openSelectPaymentModal,
		accountChainId,
		async (chainId) => {
			return new Promise<void>((resolve, reject) => {
				showSwitchChainModal({
					chainIdToSwitchTo: Number(chainId),
					onSuccess: () => {
						resolve();
					},
					onError: (error) => {
						console.log('Switch chain error', error);
						reject(error);
					},
					onClose: () => {
						closeActionModal?.();
						reject(new Error('Switch chain modal closed'));
					},
				});
			});
		},
	);
};
