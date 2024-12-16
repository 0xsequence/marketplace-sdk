import type { Hash } from 'viem';
import type { TransactionError } from '../../utils/_internal/error/transaction';
import {
	type OfferInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import {
	type UseTransactionMachineConfig,
	useTransactionMachine,
} from '../_internal/transaction-machine/useTransactionMachine';

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
			type: TransactionType.OFFER,
		},
		onSuccess,
		onError,
		onTransactionSent,
	});

	return {
		makeOffer: (props: OfferInput) => machine?.start(props),
		getOfferSteps: (props: OfferInput) => ({
			isLoading: isLoadingSteps,
			steps,
			refreshSteps: () => loadSteps(props),
		}),
		regenerateAndExecute: {
			execute: (props: OfferInput) => machine?.regenerateAndExecute(props),
			isExecuting: isRegeneratingAndExecuting,
		},
		isLoading,
		error,
	};
};
