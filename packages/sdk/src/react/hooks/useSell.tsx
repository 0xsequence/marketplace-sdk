import { useCallback, useState } from 'react';
import type { Hash } from 'viem';
import {
	type SellInput,
	type TransactionSteps,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import {
	type UseTransactionMachineConfig,
	useTransactionMachine,
} from '../_internal/transaction-machine/useTransactionMachine';

type ExecutionState = 'approval' | 'sell' | null;
interface UseSellArgs
	extends Omit<UseTransactionMachineConfig, 'type' | 'orderbookKind'> {
	onSuccess?: (hash: Hash) => void;
	onError?: (error: Error) => void;
	onTransactionSent?: (hash?: Hash) => void;
	onApprovalSuccess?: (hash: Hash) => void;
	onSwitchChainRefused: () => void;
	enabled: boolean;
}

export const useSell = ({
	onSuccess,
	onError,
	onTransactionSent,
	onApprovalSuccess,
	onSwitchChainRefused,
	enabled,
	...config
}: UseSellArgs) => {
	const [isLoading, setIsLoading] = useState(false);
	const [steps, setSteps] = useState<TransactionSteps | null>(null);
	const [executionState, setExecutionState] = useState<ExecutionState>(null);
	const machineConfig = {
		...config,
		type: TransactionType.SELL,
	};

	const { machine, isLoading: isMachineLoading } = useTransactionMachine({
		config: machineConfig,
		enabled,
		onSwitchChainRefused,
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
		async (props: SellInput) => {
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
					isExecuting: executionState === 'sell',
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
		sell: (props: SellInput) => machine?.start(props),
		getSellSteps: (props: SellInput) => ({
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
							isExecuting: executionState === 'sell',
							execute: () =>
								handleStepExecution('sell', () => steps.transaction.execute()),
						},
					}
				: null,
			refreshSteps: () => loadSteps(props),
		}),
		isLoading: isMachineLoading,
	};
};
