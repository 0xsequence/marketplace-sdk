import { useTransactionMachine } from '../_internal/transaction-machine/useTransactionMachine';
import {
	CancelInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import { ModalCallbacks } from '../ui/modals/_internal/types';
import { StepType, Step, MarketplaceKind } from '../_internal';
import { useEffect } from 'react';

export default function useCancel({
	collectionAddress,
	chainId,
	collectibleId,
	orderId,
	marketplace,
	callbacks,
}: {
	collectionAddress: string;
	chainId: string;
	collectibleId: string;
	orderId: string;
	marketplace: MarketplaceKind;
	callbacks: ModalCallbacks;
}) {
	const cancelProps = {
		orderId,
		marketplace,
	} as CancelInput;
	const machineConfig = {
		type: TransactionType.CANCEL,
		chainId: chainId,
		collectionAddress: collectionAddress,
		collectibleId: collectibleId,
	};
	const machine = useTransactionMachine({
		config: machineConfig,
		onSuccess: callbacks.onSuccess,
		onError: callbacks.onError,
	});

	async function execute() {
		if (!machine || !machine?.transactionState?.transaction.ready) return;

		const steps = machine.transactionState.steps;

		if (!steps.steps) {
			throw new Error('Steps is undefined, cannot find execution step');
		}

		const executionStep = steps.steps.find(
			(step) => step.id === StepType.cancel,
		) as Step;

		await machine.execute(
			{
				type: TransactionType.CANCEL,
				props: cancelProps,
			},
			executionStep,
		);
	}

	async function fetchSteps() {
		if (
			!machine ||
			machine.transactionState === null ||
			machine.transactionState.steps.checked
		)
			return;

		await machine.fetchSteps({
			type: TransactionType.CANCEL,
			props: cancelProps,
		});
	}

	// first time fetching steps
	useEffect(() => {
		if (!machine) return;

		fetchSteps();
	}, [machine]);

	return {
		execute,
		isLoading: machine?.transactionState?.transaction.executing,
		executed: machine?.transactionState?.transaction.executed,
	};
}
