import { useTransactionMachine } from '../_internal/transaction-machine/useTransactionMachine';
import {
	CancelInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';

export default function useCancel({
	collectionAddress,
	chainId,
	collectibleId,
	onTransactionSent,
	onSuccess,
	onError,
}: {
	collectionAddress: string;
	chainId: string;
	collectibleId: string;
	onTransactionSent?: (hash: string) => void;
	onSuccess?: (hash: string) => void;
	onError?: (error: Error) => void;
}) {
	const machine = useTransactionMachine(
		{
			type: TransactionType.CANCEL,
			chainId: chainId,
			collectionAddress: collectionAddress,
			collectibleId: collectibleId,
		},
		(hash) => onSuccess && onSuccess(hash),
		(error) => onError && onError(error),
		undefined,
		(hash) => onTransactionSent && onTransactionSent(hash),
	);

	async function execute({ orderId, marketplace }: CancelInput) {
		if (!machine?.transactionState?.transaction.execute) return;

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
