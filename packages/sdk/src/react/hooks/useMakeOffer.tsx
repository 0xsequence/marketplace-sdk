import { useState, useCallback } from 'react';
import type { Hash } from 'viem';
import {
	type OfferInput,
	TransactionType,
	type TransactionSteps,
} from '../_internal/transaction-machine/execute-transaction';
import {
	useTransactionMachine,
	type UseTransactionMachineConfig,
} from '../_internal/transaction-machine/useTransactionMachine';
import { TransactionError } from '../../utils/_internal/error/transaction';

interface UseMakeOfferArgs extends Omit<UseTransactionMachineConfig, 'type'> {
	onSuccess?: (hash: Hash) => void;
	onError?: (error: TransactionError) => void;
	onTransactionSent?: (hash: Hash) => void;
}

export const useMakeOffer = ({
	onSuccess,
	onError,
	onTransactionSent,
	...config
}: UseMakeOfferArgs) => {
	const [isLoading, setIsLoading] = useState(false);
	const [steps, setSteps] = useState<TransactionSteps | null>(null);

	const { machine } = useTransactionMachine(
		{
			...config,
			type: TransactionType.OFFER,
		},
		onSuccess,
		onError,
		onTransactionSent,
	);

	const loadSteps = useCallback(
		async (props: OfferInput) => {
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
		makeOffer: (props: OfferInput) => machine?.start(props),
		getMakeOfferSteps: (props: OfferInput) => ({
			isLoading,
			steps,
			refreshSteps: () => loadSteps(props),
		}),
	};
};
