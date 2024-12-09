import { useTransactionMachine } from '../_internal/transaction-machine/useTransactionMachine';
import {
	SellInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import { MarketplaceKind, StepType } from '../../types';
import { useEffect } from 'react';

export default function useSell({
	closeModalFn,
	collectionAddress,
	chainId,
	collectibleId,
	quantity,
	orderId,
	marketplace,
}: {
	closeModalFn: () => void;
	collectionAddress: string;
	chainId: string;
	collectibleId: string;
	orderId?: string;
	quantity?: string;
	marketplace?: MarketplaceKind;
}) {
	const sell = {
		orderId,
		tokenId: collectibleId,
		quantity,
		marketplace,
	} as SellInput;
	const machine = useTransactionMachine(
		{
			collectionAddress,
			chainId,
			collectibleId,
			type: TransactionType.OFFER,
		},
		(hash) => {
			console.log('Transaction hash', hash);
		},
		(error) => {
			console.error('Transaction error', error);
		},
		closeModalFn,
		(hash) => {
			console.log('Transaction sent', hash);
		},
	);

	async function execute() {
		if (!machine?.transactionState?.transaction.execute) return;

		await machine?.transactionState?.transaction.execute({
			type: TransactionType.SELL,
			props: sell,
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
				type: TransactionType.SELL,
				props: sell,
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
