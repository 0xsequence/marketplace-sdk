import { useState } from 'react';
import {
	type CancelInput,
	TransactionState,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import {
	type UseTransactionMachineConfig,
} from '../_internal/transaction-machine/useTransactionMachine';

interface UseCancelOrderArgs extends Omit<UseTransactionMachineConfig, 'type'> {
	onSuccess?: (hash: string) => void;
	onError?: (error: Error) => void;
	onTransactionSent?: (hash: string) => void;
}

export const useCancelOrder = ({
	onSuccess,
	onError,
	onTransactionSent,
}: UseCancelOrderArgs) => {
//	const [isLoading, setIsLoading] = useState(true);
	const [transactionState] = useState<TransactionState | null>(null);
	/*const machine = useTransactionMachine(
		{
			...config,
			type: TransactionType.CANCEL,
		},
		onSuccess,
		onError,
		undefined,
		onTransactionSent,
	);*/

	/**
	useEffect(() => {
		if (!machine || transactionState?.steps.checked) return;

		machine
			.refreshStepsGetState({
				orderId: config.orderId,
				marketplace: config.marketplace,
			})
			.then((state) => {
				if (!state.steps) return;

				setTransactionState(state);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error('Error loading make offer steps', error);
				setIsLoading(false);
			});
	}, [currency, machine, order]);	
	 */

	const handleStepExecution = async (props: CancelInput) => {
		await transactionState?.transaction.execute({
			type: TransactionType.CANCEL,
			props: {
				orderId: props.orderId,
				marketplace: props.marketplace
			},
		});
	};

	return {
		cancel: (props: CancelInput) => handleStepExecution(props),
		onError,
		onSuccess,
		onTransactionSent,
	};
};
