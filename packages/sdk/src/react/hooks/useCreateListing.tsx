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
	enabled: boolean;
}

export type Steps = {
	approval: {
		isExecuting: boolean;
		execute: () => Promise<any>;
	};
	transaction: {
		isExecuting: boolean;
		execute: () => Promise<any>;
	};
};

type ExecutionState = 'approval' | 'listing' | null;

export const useCreateListing = ({
	onSuccess,
	onError,
	onTransactionSent,
	onApprovalSuccess,
	enabled,
	...config
}: UseCreateListingArgs) => {
	const [isLoading, setIsLoading] = useState(false);
	const [steps, setSteps] = useState<TransactionSteps | null>(null);
	const [executionState, setExecutionState] = useState<ExecutionState>(null);
	const machineConfig = {
		...config,
		type: TransactionType.LISTING,
	};

	const { machine, isLoading: isMachineLoading } = useTransactionMachine({
		config: machineConfig,
		enabled,
		onSuccess: (hash) => {
			setExecutionState(null);
			onSuccess?.(hash);
		},
		onError: (error) => {
			setExecutionState(null);
			onError?.(error);
		},
		onTransactionSent,
		onApprovalSuccess: (hash) => {
			setExecutionState(null);
			onApprovalSuccess?.(hash);
		},
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
			setSteps({
				...generatedSteps,
				approval: {
					...generatedSteps.approval,
					isExecuting: executionState === 'approval',
				},
				transaction: {
					...generatedSteps.transaction,
					isExecuting: executionState === 'listing',
				},
			});
			setIsLoading(false);
		},
		[machine, executionState],
	);

	const handleStepExecution = useCallback(
		async (type: ExecutionState, execute: () => Promise<any> | undefined) => {
			if (!type) return;
			setExecutionState(type);
			try {
				await execute();
			} catch (error) {
				setExecutionState(null);
				throw error;
			}
		},
		[],
	);

	return {
		createListing: (props: ListingInput) => machine?.start(props),
		getListingSteps: (props: ListingInput) => ({
			isLoading,
			steps: steps
				? {
						...steps,
						approval: {
							...steps.approval,
							isExecuting: executionState === 'approval',
							execute: () =>
								handleStepExecution('approval', () => steps.approval.execute()),
						},
						transaction: {
							...steps.transaction,
							isExecuting: executionState === 'listing',
							execute: () =>
								handleStepExecution('listing', () =>
									steps.transaction.execute(),
								),
						},
					}
				: null,
			refreshSteps: () => loadSteps(props),
		}),
		isLoading: isMachineLoading,
	};
};
