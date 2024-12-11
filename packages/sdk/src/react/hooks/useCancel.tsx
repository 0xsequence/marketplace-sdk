import { useTransactionMachine } from '../_internal/transaction-machine/useTransactionMachine';
import {
	CancelInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import { ModalCallbacks } from '../ui/modals/_internal/types';

export default function useCancel({
	collectionAddress,
	chainId,
	collectibleId,
	callbacks,
}: {
	collectionAddress: string;
	chainId: string;
	collectibleId: string;
	callbacks: ModalCallbacks;
}) {
	const machineConfig = {
		type: TransactionType.CANCEL,
		chainId: chainId,
		collectionAddress: collectionAddress,
		collectibleId: collectibleId,
	};
	const machine = useTransactionMachine({
		config: machineConfig,
		onSuccess: callbacks.onSuccess,
		onError: callbacks.onError,
	});

	async function execute({ orderId, marketplace }: CancelInput) {
		if (!machine?.transactionState?.transaction) return;

		await machine?.transactionState?.transaction.execute({
			type: TransactionType.CANCEL,
			props: {
				orderId,
				marketplace: marketplace,
			},
		});
	}

	return {
		execute,
		isLoading: machine?.transactionState?.transaction.executing,
		executed: machine?.transactionState?.transaction.executed,
	};
}
