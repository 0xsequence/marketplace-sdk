import type { Hash } from 'viem';
import type { TransactionError } from '../../utils/_internal/error/transaction';
import {
	type ListingInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import {
	type UseTransactionMachineConfig,
	useTransactionMachine,
} from '../_internal/transaction-machine/useTransactionMachine';

interface UseCreateListingArgs extends Omit<UseTransactionMachineConfig, 'type'> {
	onSuccess?: (hash: Hash) => void;
	onError?: (error: TransactionError) => void;
	onTransactionSent?: (hash: Hash) => void;
}

export const useCreateListing = ({
	onSuccess,
	onError,
	onTransactionSent,
	...config
}: UseCreateListingArgs) => {
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
			type: TransactionType.LISTING,
		},
		onSuccess,
		onError,
		onTransactionSent,
	});

	return {
		createListing: (props: ListingInput) => machine?.start(props),
		getListingSteps: (props: ListingInput) => ({
			isLoading: isLoadingSteps,
			steps,
			refreshSteps: () => loadSteps(props),
		}),
		regenerateAndExecute: {
			execute: (props: ListingInput) => machine?.regenerateAndExecute(props),
			isExecuting: isRegeneratingAndExecuting,
		},
		isLoading,
		error,
	};
};
