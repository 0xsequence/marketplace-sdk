import {
	type BuyInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import {
	useTransactionMachine,
	type UseTransactionMachineConfig,
} from '../_internal/transaction-machine/useTransactionMachine';

interface UseBuyOrderArgs extends Omit<UseTransactionMachineConfig, 'type'> {
	onSuccess?: (hash: string) => void;
	onError?: (error: Error) => void;
	onTransactionSent?: (hash: string) => void;
}

export const useBuyCollectable = ({
	onSuccess,
	onError,
	onTransactionSent,
	...config
}: UseBuyOrderArgs) => {
	const machine = useTransactionMachine(
		{
			...config,
			type: TransactionType.BUY,
		},
		onSuccess,
		onError,
		onTransactionSent,
	);

	return {
		buy: (props: BuyInput) => machine?.start({ props }),
		onError,
		onSuccess,
		onTransactionSent,
	};
};
