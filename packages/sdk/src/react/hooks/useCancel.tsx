import {
	useTransactionMachine,
	UseTransactionMachineConfig,
} from '../_internal/transaction-machine/useTransactionMachine';
import {
	CancelInput,
	TransactionInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import { ModalCallbacks } from '../ui/modals/_internal/types';
import { useState } from 'react';

export default function useCancel({
	collectionAddress,
	chainId,
	collectibleId,
	onSuccess,
	onError,
}: {
	collectionAddress: string;
	chainId: string;
	collectibleId: string;
	onSuccess?: ModalCallbacks['onSuccess'];
	onError?: ModalCallbacks['onError'];
}) {
	const [cancelTransactionProps, setCancelTransactionProps] =
		useState<CancelInput | null>(null);
	const cancelTransactionInput = {
		type: TransactionType.CANCEL,
		props: cancelTransactionProps,
	} as TransactionInput;

	const machineConfig = {
		chainId: chainId,
		collectionAddress: collectionAddress,
		collectibleId: collectibleId,
		type: TransactionType.CANCEL,
		transactionInput: cancelTransactionInput,
		// no token approval (neither for nfts nor erc20) is needed for cancel transaction, hence executing is done without checking approval step
		fetchStepsOnInitialize: false,
		watchChainChanges: false,
	} as UseTransactionMachineConfig;
	const machine = useTransactionMachine({
		config: machineConfig,
		onSuccess,
		onError,
		onSwitchChainSuccess: async () =>
			await machine?.execute(cancelTransactionInput),
	});

	async function execute(cancelProps: CancelInput) {
		if (!machine || !cancelProps) {
			return;
		}

		if (!cancelTransactionProps) {
			setCancelTransactionProps(cancelProps);
		}

		await machine.execute({
			type: TransactionType.CANCEL,
			props: cancelProps,
		});
	}

	return {
		execute,
		isLoading: machine?.transactionState?.transaction.executing,
		executed: machine?.transactionState?.transaction.executed,
	};
}
