import { Hash } from 'viem';
import {
	type BuyInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import {
	useTransactionMachine,
	type UseTransactionMachineConfig,
} from '../_internal/transaction-machine/useTransactionMachine';
import { TransactionErrorTypes } from '../../utils/_internal/error/transaction';

type UseBuyOrderError = TransactionErrorTypes

interface UseBuyOrderArgs extends Omit<UseTransactionMachineConfig, 'type'> {
	onSuccess?: (hash: Hash) => void;
	onError?: (error: UseBuyOrderError) => void;
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
