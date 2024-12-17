import {
	type CancelInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import {
	type UseTransactionMachineConfig,
	useTransactionMachine,
} from '../_internal/transaction-machine/useTransactionMachine';

interface UseCancelOrderArgs
	extends Omit<UseTransactionMachineConfig, 'type' | 'orderbookKind'> {
	onSuccess?: (hash: string) => void;
	onError?: (error: Error) => void;
	onTransactionSent?: (hash: string) => void;
}

export const useCancelOrder = ({
	onSuccess,
	onError,
	onTransactionSent,
	...config
}: UseCancelOrderArgs) => {
	const { machine, isLoading } = useTransactionMachine(
		{
			...config,
			type: TransactionType.CANCEL,
		},
		onSuccess,
		onError,
		onTransactionSent,
	);

	return {
		cancel: (props: CancelInput) => machine?.start(props),
		onError,
		onSuccess,
		onTransactionSent,
		isLoading,
	};
};
