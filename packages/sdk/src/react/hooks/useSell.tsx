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
	const machineConfig = {
		...config,
		type: TransactionType.SELL,
	};

	const { machine, isLoading: isMachineLoading } = useTransactionMachine({
		config: machineConfig,
		enabled,
		onSwitchChainRefused,
		onSuccess,
		onError,
		onTransactionSent,
		onApprovalSuccess,
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
			setSteps(generatedSteps);
			setIsLoading(false);
		},
		[machine, onError],
	);

	return {
		sell: (props: SellInput) => machine?.start(props),
		getSellSteps: (props: SellInput) => ({
			isLoading: isLoading,
			steps,
			refreshSteps: () => loadSteps(props),
		}),
		isLoading: isMachineLoading,
	};
};
