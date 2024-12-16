import type { Hash } from 'viem';
import type { TransactionError } from '../../utils/_internal/error/transaction';
import {
	type SellInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import {
	type UseTransactionMachineConfig,
	useTransactionMachine,
} from '../_internal/transaction-machine/useTransactionMachine';

interface UseSellArgs extends Omit<UseTransactionMachineConfig, 'type'> {
	onSuccess?: (hash: Hash) => void;
	onError?: (error: TransactionError) => void;
	onTransactionSent?: (hash: Hash) => void;
}

export const useSell = ({
	onSuccess,
	onError,
	onTransactionSent,
	...config
}: UseSellArgs) => {
	const { 
		machine, 
		steps, 
		error, 
		isLoading, 
		isLoadingSteps,
		isRegeneratingAndExecuting,
		loadSteps 
	} = useTransactionMachine({
		config: {
			...config,
			type: TransactionType.SELL,
		},
		onSuccess,
		onError,
		onTransactionSent,
	});

	return {
		sell: (props: SellInput) => machine?.start(props),
		getSellSteps: (props: SellInput) => ({
			isLoading: isLoadingSteps,
			steps,
			refreshSteps: () => loadSteps(props),
		}),
		regenerateAndExecute: {
			execute: (props: SellInput) => machine?.regenerateAndExecute(props),
			isExecuting: isRegeneratingAndExecuting,
		},
		isLoading,
		error,
	};
};
