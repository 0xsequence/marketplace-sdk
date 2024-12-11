import { useTransactionMachine } from '../_internal/transaction-machine/useTransactionMachine';
import {
	SellInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import { MarketplaceKind, Step, StepType } from '../../types';
import { useEffect } from 'react';
import { ModalCallbacks } from '../ui/modals/_internal/types';

export default function useSell({
	closeModalFn,
	collectionAddress,
	chainId,
	collectibleId,
	quantity,
	orderId,
	marketplace,
	callbacks,
}: {
	closeModalFn: () => void;
	collectionAddress: string;
	chainId: string;
	collectibleId: string;
	orderId?: string;
	quantity?: string;
	marketplace?: MarketplaceKind;
	callbacks: ModalCallbacks;
}) {
	const sellProps = {
		orderId,
		quantity,
		marketplace,
	} as SellInput;
	const machineConfig = {
		collectionAddress,
		chainId,
		collectibleId,
		type: TransactionType.SELL,
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
			(step) => step.id === StepType.sell,
		) as Step;

		await machine.execute(
			{
				type: TransactionType.SELL,
				props: sellProps,
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
			type: TransactionType.SELL,
			props: sellProps,
		});
	}

	// first time fetching steps
	useEffect(() => {
		if (!machine?.transactionState || machine?.transactionState.steps.checked)
			return;

		fetchSteps();
	}, []);

	return {
		transactionState: machine?.transactionState,
		approve,
		execute,
		fetchSteps,
	};
}
