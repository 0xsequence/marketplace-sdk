import { useSelectPaymentModal } from '@0xsequence/kit-checkout';
import type { Hash } from 'viem';
import { useAccount, useSwitchChain, useWalletClient } from 'wagmi';
import {
	NoMarketplaceConfigError,
	NoWalletConnectedError,
	TransactionError,
} from '../../../utils/_internal/error/transaction';
import { useConfig, useMarketplaceConfig } from '../../hooks';
import { useSwitchChainModal } from '../../ui/modals/_internal/components/switchChainModal';
import {
	TransactionMachine,
	type TransactionMachineProps,
	type TransactionSteps,
	type TransactionMachineState,
} from './execute-transaction';
import type { Input } from './get-transaction-steps';
import { wallet } from './wallet';
import { useQuery } from '@tanstack/react-query';
import { useState, useCallback, useEffect, useRef } from 'react';

export type UseTransactionMachineConfig = Omit<TransactionMachineProps, 'config'>

export interface UseTransactionMachineArgs {
	config: UseTransactionMachineConfig;
	onSuccess?: (hash: Hash) => void;
	onError?: (error: TransactionError) => void;
	onTransactionSent?: (hash: Hash) => void;
}

export interface StepState {
	isLoading: boolean;
	steps: TransactionSteps | null 
	refreshSteps: () => Promise<void>;
}

export interface UseTransactionMachineReturn {
	machine: TransactionMachine | null | undefined;
	steps: TransactionSteps | null;
	error: TransactionError | null;
	isLoading: boolean;
	isLoadingSteps: boolean;
	isExecuting: boolean;
	isRegeneratingAndExecuting: boolean;
	loadSteps: (props: Input) => Promise<void>;
}

export const useTransactionMachine = ({
	config,
	onSuccess,
	onError,
	onTransactionSent,
}: UseTransactionMachineArgs): UseTransactionMachineReturn => {
	const [machineState, setMachineState] = useState<TransactionMachineState | null>(null);
	const lastHandledError = useRef<string | null>(null);

	const { data: walletClient, isLoading: walletClientIsLoading } = useWalletClient();
	const { show: showSwitchChainModal } = useSwitchChainModal();
	const sdkConfig = useConfig();
	const { chains } = useSwitchChain();
	const account = useAccount();

	const { data: marketplaceConfig, error: marketplaceError } = useMarketplaceConfig();
	const { openSelectPaymentModal } = useSelectPaymentModal();

	const { data: machine, error } = useQuery({
		queryKey: ['transactionMachine', config, walletClient, marketplaceConfig],
		enabled: account.isConnected && !walletClientIsLoading && !!account.connector && account.status === 'connected',
		queryFn: () => {
			if (!walletClient) {
				throw new NoWalletConnectedError();
			}

			if (!marketplaceConfig) {
				throw new NoMarketplaceConfigError();
			}

			if (marketplaceError) {
				throw new TransactionError('Marketplace config error', {
					cause: marketplaceError,
				});
			}

			const walletInstance = wallet({
				wallet: walletClient,
				chains,
				connector: account.connector!,
			});

			const switchChainFn = async () => {
				if (walletInstance.isWaaS) {
					await walletInstance.switchChain(Number(config.chainId));
					await new Promise((resolve) => setTimeout(resolve, 1000));
				} else {
					await new Promise<void>((resolve, reject) => {
						showSwitchChainModal({
							chainIdToSwitchTo: Number(config.chainId),
							onSuccess: () => resolve(),
							onError: reject,
							onClose: reject,
						});
					});
				}
			};

			const transactionMachine = new TransactionMachine({
				config: {
					sdkConfig,
					marketplaceConfig,
					wallet: walletInstance,
					switchChainFn,
					openSelectPaymentModal,
				},
				...config,
				onSuccess,
				onTransactionSent,
			});

			return transactionMachine;
		},
	});

	useEffect(() => {
		if (!machine) return;

		const unsubscribe = machine.subscribe({
			onStateChange: (state) => {
				setMachineState(state);
				if (state.error) {
					const errorMessage = state.error.message;
					if (lastHandledError.current !== errorMessage) {
						lastHandledError.current = errorMessage;
						onError?.(state.error);
					}
				} else {
					lastHandledError.current = null;
				}
			}
		});

		return () => {
			unsubscribe();
		};
	}, [machine, onError]);

	const loadSteps = useCallback(async (props: Input) => {
		if (!machine) return;
		await machine.getTransactionSteps(props);
	}, [machine]);

	return {
		machine,
		steps: machineState?.steps ?? null,
		error: error as TransactionError | null || (machineState?.error ?? null),
		isLoading: !account.isConnected ? false : !machine && !error,
		isLoadingSteps: machineState?.isLoadingSteps ?? false,
		isExecuting: machineState?.isExecuting ?? false,
		isRegeneratingAndExecuting: machineState?.isRegeneratingAndExecuting ?? false,
		loadSteps
	};
};

