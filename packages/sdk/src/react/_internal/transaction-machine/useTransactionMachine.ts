import { useSelectPaymentModal } from '@0xsequence/kit-checkout';
import type {  Hash } from 'viem';
import { useAccount, useClient, useSwitchChain, useWalletClient } from 'wagmi';
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
} from './execute-transaction';
import type { Input } from './get-transaction-steps';
import { wallet } from './wallet';

export type UseTransactionMachineConfig = Omit<TransactionMachineProps, 'config'>

export const useTransactionMachine = (
	config: UseTransactionMachineConfig,
	onSuccess?: (hash: Hash) => void,
	onError?: (error: TransactionError) => void,
	onTransactionSent?: (hash: Hash) => void,
) => {
	const { data: walletClient, isLoading: walletClientIsLoading } =
		useWalletClient();
	const { show: showSwitchChainModal } = useSwitchChainModal();
	const sdkConfig = useConfig();
	const {
		data: marketplaceConfig,
		error: marketplaceError,
		isLoading: marketplaceConfigIsLoading,
	} = useMarketplaceConfig();
	const { openSelectPaymentModal } = useSelectPaymentModal();
	const { chains } = useSwitchChain();

	const account = useAccount();
	const client = useClient();

	if (!account.isConnected) {
		// No wallet connected, TODO: add some sort of state for this
		return { machine: null, error: null, isLoading: false };
	}

	if (walletClientIsLoading || marketplaceConfigIsLoading || !account.connector || account.status != 'connected' || !client) {

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

	const walletInstance = wallet({
		wallet: walletClient,
		chains,
		connector: account.connector,
	});

	const switchChainFn = async () => {
		console.log('switching chain1111')
		if (walletInstance.isWaaS) {
			await walletInstance.switchChain(Number(config.chainId))
			console.log('switched chain')
			console.timeEnd('switch chain')
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.time('switch chain')
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
	const machine = new TransactionMachine({
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
	})

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
