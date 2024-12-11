import {
	useTransactionMachine,
	UseTransactionMachineConfig,
} from '../_internal/transaction-machine/useTransactionMachine';
import {
	OfferInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import { ContractType, Price, StepType } from '../../types';
import { useEffect } from 'react';
import { dateToUnixTime } from '../../utils/date';
import { ModalCallbacks } from '../ui/modals/_internal/types';

export default function useMakeOffer({
	closeModal: closeModalFn,
	collectionAddress,
	chainId,
	collectibleId,
	collectionType,
	offerPrice,
	quantity,
	expiry,
	callbacks,
}: {
	closeModal: () => void;
	collectionAddress: string;
	chainId: string;
	collectibleId: string;
	collectionType: ContractType | undefined;
	offerPrice: Price;
	quantity: string;
	expiry: Date;
	callbacks: ModalCallbacks;
}) {
	const offerProps = {
		tokenId: collectibleId,
		quantity,
		expiry: dateToUnixTime(expiry),
		currencyAddress: offerPrice.currency.contractAddress,
		pricePerToken: offerPrice.amountRaw,
	} as OfferInput['offer'];
	const currencyAddress = offerPrice.currency.contractAddress;
	const machineConfig = {
		transactionInput: {
			type: TransactionType.OFFER,
			props: {
				offer: offerProps,
				contractType: collectionType as ContractType,
			},
		},
		collectionAddress,
		chainId,
		collectibleId,
		type: TransactionType.OFFER,
		// for spending erc20, token approval is needed, to approval step to show up, user has to input the amount of erc20 token to approve, so we don't fetch steps on initialize
		fetchStepsOnInitialize: false,
	} as UseTransactionMachineConfig;
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

		await machine.execute({
			type: TransactionType.OFFER,
			props: {
				offer: offerProps,
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
				offer: offerProps,
			},
		});
	}

	// fetching steps to see if approval is needed
	useEffect(() => {
		if (
			!machine?.transactionState ||
			machine?.transactionState.steps.checked ||
			offerPrice.amountRaw === '0'
		)
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
