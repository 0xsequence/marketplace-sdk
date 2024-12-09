import { useTransactionMachine } from '../_internal/transaction-machine/useTransactionMachine';
import {
	CancelInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import { MarketplaceKind, StepType } from '../../types';
import { useEffect } from 'react';

export default function useCancel({
	collectionAddress,
	chainId,
	collectibleId,
	orderId,
	marketplace,
}: {
	collectionAddress: string;
	chainId: string;
	collectibleId: string;
	orderId: string;
	marketplace: MarketplaceKind;
}) {
	const cancel = {
		orderId,
		marketplace,
	} as CancelInput;
	const machine = useTransactionMachine(
		{
			type: TransactionType.CANCEL,
			chainId: chainId,
			collectionAddress: collectionAddress,
			collectibleId: collectibleId,
		},
		(hash) => {
			console.log('Transaction hash', hash);
		},
		(error) => {
			console.error('Transaction error', error);
		},
		undefined,
		(hash) => {
			console.log('Transaction sent', hash);
		},
	);

	async function execute() {
		if (!machine?.transactionState?.transaction.execute) return;

		await machine?.transactionState?.transaction.execute({
			type: TransactionType.CANCEL,
			props: cancel,
		});
	}

	async function fetchSteps() {
		if (!machine || machine.transactionState === null) return;

		machine.setTransactionState((prev) => ({
			...prev!,
			steps: { ...prev!.steps, checking: true },
		}));

		try {
			const steps = await machine.fetchSteps({
				type: TransactionType.CANCEL,
				props: cancel,
			});
			const approvalStep = steps.find(
				(step) => step.id === StepType.tokenApproval,
			);

			machine.setTransactionState((prev) => ({
				...prev!,
				approval: {
					...machine.transactionState!.approval,
					needed: !!approvalStep,
				},
			}));
		} catch (error) {
			console.error('Error refreshing steps', error);
			machine.setTransactionState((prev) => ({
				...prev!,
				steps: { ...prev!.steps, checking: false },
			}));
		}
	}

	// first time fetching steps
	useEffect(() => {
		if (!machine?.transactionState || machine?.transactionState.steps.checked)
			return;

		fetchSteps();
	}, [machine?.transactionState]);

	return {
		transactionState: machine?.transactionState,
		execute,
		fetchSteps,
	};
}
