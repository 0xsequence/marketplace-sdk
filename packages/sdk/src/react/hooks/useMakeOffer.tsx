import { useTransactionMachine } from '../_internal/transaction-machine/useTransactionMachine';
import {
	OfferInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import { ContractType, Price, Step, StepType } from '../../types';
import { useEffect } from 'react';
import { dateToUnixTime } from '../../utils/date';

export default function useMakeOffer({
	closeModal: closeModalFn,
	collectionAddress,
	chainId,
	collectibleId,
	collectionType,
	offerPrice,
	quantity,
	expiry,
}: {
	closeModal: () => void;
	collectionAddress: string;
	chainId: string;
	collectibleId: string;
	collectionType: ContractType | undefined;
	offerPrice: Price;
	quantity: string;
	expiry: Date;
}) {
	const offer = {
		tokenId: collectibleId,
		quantity,
		expiry: dateToUnixTime(expiry),
		currencyAddress: offerPrice.currency.contractAddress,
		pricePerToken: offerPrice.amountRaw,
	} as OfferInput['offer'];
	const currencyAddress = offerPrice.currency.contractAddress;
	const machine = useTransactionMachine(
		{
			collectionAddress,
			chainId,
			collectibleId,
			type: TransactionType.OFFER,
		},
		closeModalFn,
		(hash) => {
			console.log('Transaction hash', hash);
		},
		(error) => {
			console.error('Transaction error', error);
		},
		(hash) => {
			console.log('Transaction sent', hash);
		},
	);

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
			(step) => step.id === StepType.createOffer,
		) as Step;

		await machine.execute(
			{
				type: TransactionType.OFFER,
				props: {
					offer: offer,
					contractType: collectionType as ContractType,
				},
			},
			executionStep,
		);
	}

	async function fetchSteps() {
		if (
			!currencyAddress ||
			!machine ||
			offerPrice.amountRaw === '0' ||
			machine.transactionState === null ||
			machine.transactionState.steps.checked
		)
			return;

		await machine.fetchSteps({
			type: TransactionType.OFFER,
			props: {
				contractType: collectionType as ContractType,
				offer: offer,
			},
		});
	}

	// first time fetching steps
	useEffect(() => {
		if (!machine?.transactionState || machine?.transactionState.steps.checked)
			return;

		fetchSteps();
	}, [currencyAddress, offerPrice.amountRaw]);

	return {
		transactionState: machine?.transactionState,
		approve,
		execute,
		fetchSteps,
	};
}
