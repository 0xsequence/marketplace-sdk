import { useTransactionMachine } from '../_internal/transaction-machine/useTransactionMachine';
import {
	OfferInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import { ContractType, Price, StepType } from '../../types';
import { useEffect } from 'react';
import { dateToUnixTime } from '../../utils/date';

export default function useMakeOffer({
	closeModalFn,
	collectionAddress,
	chainId,
	collectibleId,
	collectionType,
	offerPrice,
	quantity,
	expiry,
}: {
	closeModalFn: () => void;
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

	async function approve() {
		if (!machine?.transactionState) return;

		const steps = machine.transactionState.steps;

		if (!steps.steps) {
			throw new Error('Steps is undefined, cannot find approval step');
		}

		const approvalStep = steps.steps.find(
			(step) => step.id === StepType.tokenApproval,
		);

		console.log('approvalStep', approvalStep);

		await machine.approve({
			approvalStep: approvalStep!,
		});
	}

	async function execute() {
		if (!machine?.transactionState?.transaction.execute) return;

		await machine?.transactionState?.transaction.execute({
			type: TransactionType.OFFER,
			props: {
				offer: offer,
				contractType: collectionType as ContractType,
			},
		});
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

	console.log('transactionState', machine?.transactionState);

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
