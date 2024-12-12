import { useSelectPaymentModal } from '@0xsequence/kit-checkout';
import type { Hash, Hex } from 'viem';
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
	type TransactionState,
} from './execute-transaction';
import { useState } from 'react';
import { useTransactionStatusModal } from '../../ui/modals/_internal/components/transactionStatusModal';

export type UseTransactionMachineConfig = Omit<
	TransactionConfig,
	'sdkConfig' | 'marketplaceConfig' | 'walletKind' | 'chains'
>;

export const useTransactionMachine = ({
	config,
	closeActionModalCallback,
	onSuccess,
	onError,
}: {
	config: UseTransactionMachineConfig;
	closeActionModalCallback?: () => void;
	onSuccess?: (hash: Hash) => void;
	onError?: (error: Error) => void;
}) => {
	const [transactionState, setTransactionState] =
		useState<TransactionState>(null);
	const { data: walletClient } = useWalletClient();
	const { show: showSwitchChainModal } = useSwitchChainModal();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const sdkConfig = useConfig();
	const {
		data: marketplaceConfig,
		error: marketplaceError,
		isLoading: marketplaceConfigIsLoading,
	} = useMarketplaceConfig();
	const { openSelectPaymentModal } = useSelectPaymentModal();
	const { chains } = useSwitchChain();
	const { connector, chainId: accountChainId } = useAccount();
	const walletKind =
		connector?.id === 'sequence' ? WalletKind.sequence : WalletKind.unknown;

	if (!isConnected) {
		// No wallet connected, TODO: add some sort of state for this
		return { machine: null, error: null, isLoading: false };
	}

	if (!walletClient || !marketplaceConfig || !accountChainId) return null;

	const transactionMachine = new TransactionMachine(
		{
			config: { sdkConfig, marketplaceConfig, walletKind, chains, ...config },
			onSuccess,
			onError,
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
						reject(error);
					},
					onClose: () => {
						closeActionModalCallback?.();
						reject(new Error('User rejected chain switch'));
					},
				});
			});
		},
		transactionState,
		setTransactionState,
		closeActionModalCallback ?? (() => {}),
		({ hash, blocked }) => {
			showTransactionStatusModal({
				chainId: String(accountChainId),
				collectionAddress: config.collectionAddress as Hex,
				collectibleId: config.collectibleId as string,
				hash: hash,
				type: config.transactionInput.type,
				callbacks: {
					onError: onError,
					onSuccess: onSuccess,
				},
				blocked,
			});
		},
	);

	return transactionMachine;
};
