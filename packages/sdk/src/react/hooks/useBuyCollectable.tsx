import type { Hash } from 'viem';
import type { TransactionError } from '../../utils/_internal/error/transaction';
import {
	type BuyInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import {
	type UseTransactionMachineConfig,
	useTransactionMachine,
} from '../_internal/transaction-machine/useTransactionMachine';

interface UseBuyCollectableArgs extends Omit<UseTransactionMachineConfig, 'type'> {
	onSuccess?: (hash: Hash) => void;
	onError?: (error: TransactionError) => void;
	onTransactionSent?: (hash: Hash) => void;
}

export const useBuyCollectable = ({
	onSuccess,
	onError,
	onTransactionSent,
	...config
}: UseBuyCollectableArgs) => {
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
			type: TransactionType.BUY,
		},
		onSuccess,
		onError,
		onTransactionSent,
	});

	return {
		buy: (props: BuyInput) => machine?.start(props),
		getBuySteps: (props: BuyInput) => ({
			isLoading: isLoadingSteps,
			steps,
			refreshSteps: () => loadSteps(props),
		}),
		regenerateAndExecute: {
			execute: (props: BuyInput) => machine?.regenerateAndExecute(props),
			isExecuting: isRegeneratingAndExecuting,
		},
		isLoading,
		error,
	};
};
