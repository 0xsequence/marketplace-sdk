import { useSelectPaymentModal } from '@0xsequence/kit-checkout';
import type { Hash } from 'viem';
import { useAccount, useSwitchChain } from 'wagmi';
import {
	NoMarketplaceConfigError,
	NoWalletConnectedError,
	TransactionError,
} from '../../../utils/_internal/error/transaction';
import { useConfig, useMarketplaceConfig } from '../../hooks';
import { useSwitchChainModal } from '../../ui/modals/_internal/components/switchChainModal';
import {
	type Input,
	type TransactionConfig,
	TransactionMachine,
} from './execute-transaction';

import { useWallet } from './useWallet';
export type UseTransactionMachineConfig = Omit<
	TransactionConfig,
	'sdkConfig' | 'marketplaceConfig' | 'walletKind' | 'chains'
>;

export const useTransactionMachine = ({
	config,
	enabled,
	onSuccess,
	onError,
	onTransactionSent,
	onApprovalSuccess,
	onPaymentModalLoaded,
}: {
	config: UseTransactionMachineConfig;
	enabled: boolean;
	onSuccess?: (hash: Hash) => void;
	onError?: (error: TransactionError) => void;
	onTransactionSent?: (
		hash?: Hash,
		orderId?: string,
		isApproval?: boolean,
	) => void;
	onApprovalSuccess?: (hash: Hash) => void;
	onPaymentModalLoaded?: () => void;
}) => {
	const { show: showSwitchChainModal } = useSwitchChainModal();
	const sdkConfig = useConfig();
	const {
		data: marketplaceConfig,
		error: marketplaceError,
		isLoading: marketplaceConfigIsLoading,
	} = useMarketplaceConfig();
	const { openSelectPaymentModal } = useSelectPaymentModal();
	const { chains } = useSwitchChain();

	const { isConnected } = useAccount();
	const {
		wallet: walletInstance,
		isLoading: walletClientIsLoading,
		isError: walletClientIsError,
	} = useWallet();

	if (!enabled) return { machine: null, error: null, isLoading: false };

	if (!isConnected) {
		// No wallet connected, TODO: add some sort of state for this
		return { machine: null, error: null, isLoading: false };
	}

	if (walletClientIsLoading || marketplaceConfigIsLoading) {
		return { machine: null, error: null, isLoading: true };
	}

	if (marketplaceError) {
		const error = new TransactionError('Marketplace config error', {
			cause: marketplaceError,
		});
		onError?.(error);
		return { machine: null, error };
	}

	if (walletClientIsError) {
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
			config: {
				sdkConfig,
				marketplaceConfig,
				chains,
				...config,
			},
			onSuccess,
			onTransactionSent,
			onApprovalSuccess,
		},
		walletInstance,
		openSelectPaymentModal,
		async () =>
			new Promise((resolve, reject) => {
				showSwitchChainModal({
					chainIdToSwitchTo: Number(config.chainId),
					onSuccess: resolve,
					onError: reject,
					onClose: reject,
				});
			}),
		onPaymentModalLoaded,
	);

	return {
		machine: {
			getTransactionSteps: async (props: Input) => {
				try {
					return await machine.getTransactionSteps(props);
				} catch (e) {
					const error = e as TransactionError;
					onError?.(error);
				}
			},
			start: async (props: Input) => {
				try {
					await machine.start(props);
				} catch (e) {
					const error = e as TransactionError;
					onError?.(error);
				}
			},
		},
		error: null,
		isLoading: false,
	};
};
