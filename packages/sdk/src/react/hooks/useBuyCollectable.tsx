import type { Hash, Hex } from 'viem';
import type { TransactionErrorTypes } from '../../utils/_internal/error/transaction';
import {
	type BuyInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import {
	type UseTransactionMachineConfig,
	useTransactionMachine,
} from '../_internal/transaction-machine/useTransactionMachine';

type UseBuyOrderError = TransactionErrorTypes;

interface UseBuyOrderArgs
	extends Omit<UseTransactionMachineConfig, 'type' | 'orderbookKind'> {
	onSuccess?: (hash: Hash) => void;
	onError?: (error: UseBuyOrderError) => void;
	onTransactionSent?: (hash?: Hex) => void;
}

export const useBuyCollectable = ({
	onSuccess,
	onError,
	onTransactionSent,
	...config
}: UseBuyOrderArgs) => {
	const { machine, error, isLoading } = useTransactionMachine(
		{
			...config,
			type: TransactionType.BUY,
		},
		onSuccess,
		onError,
		onTransactionSent,
	);

	return {
		buy: (props: BuyInput) => {
			if (!machine || isLoading) return;
			machine.start(props);
		},
		isLoading,
		error,
	};
};
