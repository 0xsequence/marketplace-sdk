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
	TransactionState,
} from './execute-transaction';
import { useEffect, useState } from 'react';

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
	const [transactionState, setTransactionState] =
		useState<TransactionState>(null);
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

	useEffect(() => {
		if (!transactionState) return;

		const isCorrectChain = accountChainId === Number(config.chainId);
		const needsChainSwitch = transactionState.switchChain.needed;

		if (isCorrectChain === needsChainSwitch) {
			setTransactionState((state) => ({
				...state!,
				switchChain: { ...state!.switchChain, needed: !isCorrectChain },
			}));
		}
	}, [transactionState, accountChainId, config.chainId]);

	if (marketplaceError) {
		throw marketplaceError; //TODO: Add error handling
	}

	if (!walletClient || !marketplaceConfig || !accountChainId) return null;

	const transactionMachine = new TransactionMachine(
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
						reject(new Error('User rejected chain switch'));
					},
				});
			});
		},
		transactionState,
		setTransactionState,
	);

	return transactionMachine;
};
