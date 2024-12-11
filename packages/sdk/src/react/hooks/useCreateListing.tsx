import { useTransactionMachine } from '../_internal/transaction-machine/useTransactionMachine';
import {
	ListingInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import { ContractType, Price, StepType, Step } from '../../types';
import { useEffect } from 'react';
import { dateToUnixTime } from '../../utils/date';
import { ModalCallbacks } from '../ui/modals/_internal/types';

export default function useCreateListing({
	closeModalFn,
	collectionAddress,
	chainId,
	collectibleId,
	collectionType,
	expiry,
	pricePerToken,
	quantity,
	callbacks,
}: {
	closeModalFn: () => void;
	collectionAddress: string;
	chainId: string;
	collectibleId: string;
	collectionType: ContractType | undefined;
	expiry: Date;
	pricePerToken: Price;
	quantity: string;
	callbacks: ModalCallbacks;
}) {
	const listingProps = {
		tokenId: collectibleId,
		expiry: dateToUnixTime(expiry),
		currencyAddress: pricePerToken.currency.contractAddress,
		quantity,
		pricePerToken: pricePerToken.amountRaw,
	} as ListingInput['listing'];
	const machineConfig = {
		collectionAddress,
		chainId,
		collectibleId,
		type: TransactionType.LISTING,
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
			(step) => step.id === StepType.createListing,
		) as Step;

		await machine.execute(
			{
				type: TransactionType.LISTING,
				props: {
					listing: listingProps,
					contractType: collectionType as ContractType,
				},
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
			type: TransactionType.LISTING,
			props: {
				contractType: collectionType as ContractType,
				listing: listingProps,
			},
		});
	}

	// first time fetching steps
	useEffect(() => {
		if (!machine?.transactionState || machine?.transactionState.steps.checked)
			return;

		fetchSteps();
	}, [pricePerToken.amountRaw]);

	return {
		transactionState: machine?.transactionState,
		approve,
		execute,
		fetchSteps,
	};
}
