import {
	useTransactionMachine,
	type UseTransactionMachineConfig,
} from '../_internal/transaction-machine/useTransactionMachine';
import {
	type CancelInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import type { ModalCallbacks } from '../ui/modals/_internal/types';

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
	const machineConfig = {
		chainId: chainId,
		collectionAddress: collectionAddress,
		collectibleId: collectibleId,
		// no token approval (neither for nfts nor erc20) is needed for cancel transaction, hence executing is done without checking approval step
		fetchStepsOnInitialize: false,
	} as UseTransactionMachineConfig;
	const machine = useTransactionMachine({
		config: machineConfig,
		onSuccess,
		onError,
	});

	async function execute(cancelProps: CancelInput) {
		if (!machine) return;

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
