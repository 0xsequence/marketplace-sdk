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
import { TransactionError } from '../../utils/_internal/error/transaction';

interface UseCreateListingArgs
	extends Omit<UseTransactionMachineConfig, 'type'> {
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
	const [isLoading, setIsLoading] = useState(false);
	const [steps, setSteps] = useState<TransactionSteps | null>(null);

	const { machine, isLoading: isMachineLoading } = useTransactionMachine(
		{
			...config,
			type: TransactionType.LISTING,
		},
		onSuccess,
		onError,
		onTransactionSent,
	);

	const loadSteps = useCallback(
		async (props: ListingInput) => {
			if (!machine) return;
			setIsLoading(true);
			const generatedSteps = await machine.getTransactionSteps(props);
			if (!generatedSteps) {
				setIsLoading(false);
				return;
			}
			setSteps(generatedSteps);
			setIsLoading(false);
		},
		[machine, onError],
	);

	return {
		createListing: (props: ListingInput) => machine?.start(props),
		getListingSteps: (props: ListingInput) => ({
			isLoading,
			steps,
			refreshSteps: () => loadSteps(props),
		}),
		isLoading: isMachineLoading,
	};
};
