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
}

export const useSell = ({
	onSuccess,
	onError,
	onTransactionSent,
	...config
}: UseSellArgs) => {
	const [isLoading, setIsLoading] = useState(false);
	const [steps, setSteps] = useState<TransactionSteps | null>(null);

	const { machine, isLoading: isMachineLoading } = useTransactionMachine(
		{
			...config,
			type: TransactionType.SELL,
		},
		onSuccess,
		onError,
		onTransactionSent,
	);

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
