import type { Hex } from 'viem';
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
	onTransactionSent?: (hash?: Hex) => void;
	onSwitchChainRefused: () => void;
	enabled: boolean;
}

export const useCancelOrder = ({
	onSuccess,
	onError,
	onTransactionSent,
	onSwitchChainRefused,
	enabled,
	...config
}: UseCancelOrderArgs) => {
	const machineConfig = {
		...config,
		type: TransactionType.CANCEL,
	};
	const { machine, isLoading } = useTransactionMachine({
		config: machineConfig,
		enabled,
		onSwitchChainRefused,
		onSuccess,
		onError,
		onTransactionSent,
	});

	return {
		cancel: (props: CancelInput) => machine?.start(props),
		onError,
		onSuccess,
		onTransactionSent,
		isLoading,
	};
};
