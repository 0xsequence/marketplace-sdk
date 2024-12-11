import { useTransactionMachine } from '../_internal/transaction-machine/useTransactionMachine';
import { TransactionType } from '../_internal/transaction-machine/execute-transaction';
import { MarketplaceKind, Step, StepType } from '../../types';
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
	const buyProps = { orderId, collectableDecimals, marketplace, quantity };
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

	async function approve() {
		if (!machine?.transactionState) return;

		const steps = machine.transactionState.steps;

		if (!steps.steps) {
			throw new Error('Steps is undefined, cannot find approval step');
		}

		const approvalStep = steps.steps.find(
			(step) => step.id === StepType.tokenApproval,
		);

		await machine.approve({
			approvalStep: approvalStep!,
		});
	}

	async function execute() {
		if (!machine || !machine?.transactionState?.transaction.ready) return;

		const steps = machine.transactionState.steps;

		if (!steps.steps) {
			throw new Error('Steps is undefined, cannot find execution step');
		}

		const executionStep = steps.steps.find(
			(step) => step.id === StepType.buy,
		) as Step;

		await machine.execute(
			{
				type: TransactionType.BUY,
				props: buyProps,
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
			type: TransactionType.BUY,
			props: buyProps
		});
	}

	// first time fetching steps
	useEffect(() => {
		if (!machine?.transactionState || machine?.transactionState.steps.checked)
			return;

		fetchSteps();
	}, [currencyAddress, machine]);

	return {
		transactionState: machine?.transactionState,
		approve,
		execute,
		fetchSteps,
	};
}
