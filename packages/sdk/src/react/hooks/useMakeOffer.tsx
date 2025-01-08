import { useCallback, useState } from 'react';
import type { Hash } from 'viem';
import type { TransactionError } from '../../utils/_internal/error/transaction';
import {
	type OfferInput,
	type TransactionSteps,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import {
	type UseTransactionMachineConfig,
	useTransactionMachine,
} from '../_internal/transaction-machine/useTransactionMachine';

interface UseMakeOfferArgs extends Omit<UseTransactionMachineConfig, 'type'> {
	onSuccess?: (hash: Hash) => void;
	onError?: (error: TransactionError) => void;
	onTransactionSent?: (hash?: Hash, orderId?: string) => void;
	onApprovalSuccess?: (hash: Hash) => void;
	onSwitchChainRefused: () => void;
	enabled: boolean;
}

type ExecutionState = 'approval' | 'offer' | null;

export const useMakeOffer = ({
	onSuccess,
	onError,
	onTransactionSent,
	onApprovalSuccess,
	onSwitchChainRefused,
	enabled,
	...config
}: UseMakeOfferArgs) => {
	const [isLoading, setIsLoading] = useState(false);
	const [steps, setSteps] = useState<TransactionSteps | null>(null);
	const [executionState, setExecutionState] = useState<ExecutionState>(null);
	const machineConfig = {
		...config,
		type: TransactionType.OFFER,
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
		onSwitchChainRefused,
	});

	const loadSteps = useCallback(
		async (props: OfferInput) => {
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
					isExecuting: executionState === 'offer',
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
		makeOffer: (props: OfferInput) => machine?.start(props),
		getMakeOfferSteps: (props: OfferInput) => ({
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
							isExecuting: executionState === 'offer',
							execute: () =>
								handleStepExecution('offer', () => steps.transaction.execute()),
						},
					}
				: null,
			refreshSteps: () => loadSteps(props),
		}),
		isLoading: isMachineLoading,
	};
};
