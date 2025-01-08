import { useCallback, useState } from 'react';
import type { Hash } from 'viem';
import type { TransactionError } from '../../utils/_internal/error/transaction';
import {
	type ListingInput,
	type TransactionSteps,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import {
	type UseTransactionMachineConfig,
	useTransactionMachine,
} from '../_internal/transaction-machine/useTransactionMachine';

interface UseCreateListingArgs
	extends Omit<UseTransactionMachineConfig, 'type'> {
	onSuccess?: (hash: Hash) => void;
	onError?: (error: TransactionError) => void;
	onTransactionSent?: (hash?: Hash, orderId?: string) => void;
	onApprovalSuccess?: (hash: Hash) => void;
	onSwitchChainRefused: () => void;
	enabled: boolean;
}

export const useCreateListing = ({
	onSuccess,
	onError,
	onTransactionSent,
	onApprovalSuccess,
	onSwitchChainRefused,
	enabled,
	...config
}: UseCreateListingArgs) => {
	const [isLoading, setIsLoading] = useState(false);
	const [steps, setSteps] = useState<TransactionSteps | null>(null);
	const machineConfig = {
		...config,
		type: TransactionType.LISTING,
	};

	const { machine, isLoading: isMachineLoading } = useTransactionMachine({
		config: machineConfig,
		enabled,
		onSuccess,
		onError,
		onTransactionSent,
		onApprovalSuccess,
		onSwitchChainRefused,
	});

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
		[machine],
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
