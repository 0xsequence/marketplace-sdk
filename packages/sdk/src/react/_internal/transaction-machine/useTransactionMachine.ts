import { useSelectPaymentModal } from '@0xsequence/kit-checkout';
import type { Hash } from 'viem';
import { useAccount, useSwitchChain, useWalletClient } from 'wagmi';
import { getPublicRpcClient } from '../../../utils';
import { NoMarketplaceConfigError, NoWalletConnectedError, TransactionError } from '../../../utils/_internal/error/transaction';
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
	onTransactionSent?: (hash: Hash) => void,
) => {
	const { data: walletClient } = useWalletClient();
	const { show: showSwitchChainModal } = useSwitchChainModal();
	const sdkConfig = useConfig();
	const { data: marketplaceConfig, error: marketplaceError } =
		useMarketplaceConfig();
	const { openSelectPaymentModal } = useSelectPaymentModal();
	const { chains } = useSwitchChain();

	const { connector } = useAccount();
	const walletKind =
		connector?.id === 'sequence' ? WalletKind.sequence : WalletKind.unknown;

	if (marketplaceError) {
		const error = new TransactionError('Marketplace config error', { cause: marketplaceError });
		onError?.(error);
		return { machine: null, error };
	}

	if (!walletClient) {
		const error = new NoWalletConnectedError();
		onError?.(error);
		return { machine: null, error };
	}

	if (!marketplaceConfig) {
		const error = new NoMarketplaceConfigError();
		onError?.(error);
		return { machine: null, error };
	}

	const machine = new TransactionMachine(
		{
			config: { sdkConfig, marketplaceConfig, walletKind, chains, ...config },
			onSuccess,
			onTransactionSent,
		},
		walletClient,
		getPublicRpcClient(config.chainId),
		openSelectPaymentModal,
		async (chainId) => {
			return new Promise<void>((resolve, reject) => {
				showSwitchChainModal({
					chainIdToSwitchTo: Number(chainId),
					onSuccess: resolve,
					onError: reject,
				});
			});
		},
	);

	return {
		machine: {
			getTransactionSteps: async (props: any) => {
				try {
					return await machine.getTransactionSteps(props);
				} catch (error) {
					const transactionError = error instanceof TransactionError
						? error
						: new TransactionError('Failed to get transaction steps', { cause: error as Error });
					onError?.(transactionError);
					throw transactionError;
				}
			},
			start: async (props: { props: any }) => {
				try {
					await machine.start(props);
				} catch (error) {
					const transactionError = error instanceof TransactionError
						? error
						: new TransactionError('Transaction failed', { cause: error as Error });
					onError?.(transactionError);
				}
			}
		},
		error: null
	};
};
