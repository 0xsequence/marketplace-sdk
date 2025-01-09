import { useSelectPaymentModal } from '@0xsequence/kit-checkout';
import type { Hash } from 'viem';
import { useAccount, useSwitchChain, useWalletClient } from 'wagmi';
import { getPublicRpcClient } from '../../../utils';
import {
	NoMarketplaceConfigError,
	NoWalletConnectedError,
	TransactionError,
} from '../../../utils/_internal/error/transaction';
import { useConfig, useMarketplaceConfig } from '../../hooks';
import { useSwitchChainModal } from '../../ui/modals/_internal/components/switchChainModal';
import { WalletKind } from '../api';
import {
	type Input,
	type TransactionConfig,
	TransactionMachine,
} from './execute-transaction';

export type UseTransactionMachineConfig = Omit<
	TransactionConfig,
	'sdkConfig' | 'marketplaceConfig' | 'walletKind' | 'chains' | 'isWaaS'
>;

export const useTransactionMachine = ({
	config,
	enabled,
	onSuccess,
	onError,
	onTransactionSent,
	onApprovalSuccess,
	onSwitchChainRefused,
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
	onSwitchChainRefused: () => void;
	onPaymentModalLoaded: () => void;
}) => {
	const { data: walletClient, isLoading: walletClientIsLoading } =
		useWalletClient();
	const { show: showSwitchChainModal, close: closeSwitchChainModal } =
		useSwitchChainModal();
	const sdkConfig = useConfig();
	const {
		data: marketplaceConfig,
		error: marketplaceError,
		isLoading: marketplaceConfigIsLoading,
	} = useMarketplaceConfig();
	const { openSelectPaymentModal } = useSelectPaymentModal();
	const { chains } = useSwitchChain();

	const { connector, isConnected, chainId: accountChainId } = useAccount();
	const walletKind =
		connector?.id === 'sequence' ? WalletKind.sequence : WalletKind.unknown;

	// TODO: remove this once we have a better way to check if the wallet is a WAAS wallet
	const isWaaS = connector?.id.endsWith('waas') || false;

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

	if (accountChainId !== Number(config.chainId)) {
		showSwitchChainModal({
			chainIdToSwitchTo: Number(config.chainId),
			onSuccess: () => {
				closeSwitchChainModal();
			},
			onError: (err) => {
				throw err;
			},
			onClose: () => {
				onSwitchChainRefused();
			},
		});
		return { machine: null, error: null, isLoading: false };
	}

	const machine = new TransactionMachine(
		{
			config: {
				sdkConfig,
				marketplaceConfig,
				walletKind,
				chains,
				...config,
				isWaaS,
			},
			onSuccess,
			onTransactionSent,
			onApprovalSuccess,
		},
		walletClient,
		getPublicRpcClient(config.chainId),
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
