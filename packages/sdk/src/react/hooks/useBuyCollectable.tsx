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
	onSwitchChainRefused: () => void;
	enabled: boolean;
}

export const useBuyCollectable = ({
	onSuccess,
	onError,
	onTransactionSent,
	onSwitchChainRefused,
	enabled,
	...config
}: UseBuyOrderArgs) => {
	const machineConfig = {
		...config,
		type: TransactionType.BUY,
	};
	const { machine, error, isLoading } = useTransactionMachine({
		config: machineConfig,
		enabled,
		onSwitchChainRefused,
		onSuccess,
		onError,
		onTransactionSent,
	});

	return {
		buy: (props: BuyInput) => {
			if (!machine || isLoading) return;
			machine.start(props);
		},
		isLoading,
		error,
	};
};
