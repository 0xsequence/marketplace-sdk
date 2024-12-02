import { useState, useCallback } from 'react';
import type { Hash } from 'viem';
import {
	type ListingInput,
	TransactionType,
	type TransactionSteps,
} from '../_internal/transaction-machine/execute-transaction';
import {
	useTransactionMachine,
	type UseTransactionMachineConfig,
} from '../_internal/transaction-machine/useTransactionMachine';

interface UseCreateListingArgs
	extends Omit<UseTransactionMachineConfig, 'type'> {
	onSuccess?: (hash: Hash) => void;
	onError?: (error: Error) => void;
}

export const useCreateListing = ({
	onSuccess,
	onError,
	...config
}: UseCreateListingArgs) => {
	const [isLoading, setIsLoading] = useState(false);
	const [steps, setSteps] = useState<TransactionSteps | null>(null);

	const machine = useTransactionMachine(
		{
			...config,
			type: TransactionType.LISTING,
		},
		onSuccess,
		onError,
	);

	const loadSteps = useCallback(
		async (props: ListingInput) => {
			if (!machine) return;
			setIsLoading(true);
			try {
				const generatedSteps = await machine.getTransactionSteps(props);
				setSteps(generatedSteps);
			} catch (error) {
				onError?.(error as Error);
			} finally {
				setIsLoading(false);
			}
		},
		[machine, onError],
	);

	return {
		createListing: (props: ListingInput) => machine?.start({ props }),
		getListingSteps: (props: ListingInput) => ({
			isLoading,
			steps,
			refreshSteps: () => loadSteps(props),
		}),
		onError,
		onSuccess,
	};
};
