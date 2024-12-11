import { useTransactionMachine } from '../_internal/transaction-machine/useTransactionMachine';
import { TransactionType } from '../_internal/transaction-machine/execute-transaction';
import { MarketplaceKind, StepType } from '../../types';
import { useEffect } from 'react';
import { ModalCallbacks } from '../ui/modals/_internal/types';

export default function useBuy({
	closeModalFn,
	collectionAddress,
	chainId,
	orderId,
	collectableDecimals,
	marketplace,
	quantity,
	currencyAddress,
	callbacks,
}: {
	closeModalFn: () => void;
	collectionAddress: string;
	chainId: string;
	orderId: string;
	collectableDecimals: number;
	marketplace: MarketplaceKind;
	quantity: string;
	currencyAddress: string;
	callbacks: ModalCallbacks;
}) {
	const machineConfig = {
		collectionAddress,
		chainId,
		type: TransactionType.BUY,
	};
	const machine = useTransactionMachine({
		config: machineConfig,
		closeActionModalCallback: closeModalFn,
		onSuccess: callbacks.onSuccess,
		onError: callbacks.onError,
	});
	const buyProps = { orderId, collectableDecimals, marketplace, quantity };

	async function execute() {
		if (!machine?.transactionState?.transaction.execute) return;

		await machine?.transactionState?.transaction.execute({
			type: TransactionType.BUY,
			props: buyProps,
		});
	}

	async function fetchSteps() {
		if (!currencyAddress || !machine || machine.transactionState === null)
			return;

		machine.setTransactionState((prev) => ({
			...prev!,
			steps: { ...prev!.steps, checking: true },
		}));

		try {
			const steps = await machine.fetchSteps({
				type: TransactionType.BUY,
				props: { orderId, collectableDecimals, marketplace, quantity },
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
	}, [currencyAddress]);

	return {
		transactionState: machine?.transactionState,
		execute,
		fetchSteps,
	};
}
