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
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

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
	const [executed, setExecuted] = useState(false);
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
	});
	const { chainId: accountChainId } = useAccount();

	useEffect(() => {
		if (
			accountChainId &&
			Number(chainId) === accountChainId &&
			machine &&
			!executed
		) {
			execute();

			setExecuted(true);
		}
	}, [accountChainId, machine, executed]);

	async function execute() {
		if (!machine || !cancelTransactionProps) {
			return;
		}

		await machine.execute({
			type: TransactionType.CANCEL,
			props: cancelTransactionProps,
		});

		setExecuted(true);
	}

	return {
		execute,
		isLoading: machine?.transactionState?.transaction.executing,
		executed: machine?.transactionState?.transaction.executed,
		setCancelTransactionProps,
	};
}
