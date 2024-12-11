import { useTransactionMachine } from '../_internal/transaction-machine/useTransactionMachine';
import {
	ListingInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import { ContractType, Price, StepType } from '../../types';
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
	callbacks
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
	const listing = {
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
	},
	const machine = useTransactionMachine({config: machineConfig, closeActionModalCallback: closeModalFn, onSuccess: callbacks.onSuccess, onError: callbacks.onError});

	async function approve() {
		if (!machine?.transactionState?.approval.approve) return;

		await machine.transactionState.approval.approve();
	}

	async function execute() {
		if (!machine?.transactionState?.transaction.execute) return;

		await machine?.transactionState?.transaction.execute({
			type: TransactionType.LISTING,
			props: {
				listing: listing,
				contractType: collectionType as ContractType,
			},
		});
	}

	async function fetchSteps() {
		if (
			!machine ||
			pricePerToken.amountRaw === '0' ||
			machine.transactionState === null
		)
			return;

		machine.setTransactionState((prev) => ({
			...prev!,
			steps: { ...prev!.steps, checking: true },
		}));

		try {
			const steps = await machine.fetchSteps({
				type: TransactionType.LISTING,
				props: {
					listing: listing,
					contractType: collectionType as ContractType,
				},
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
		if (
			!machine?.transactionState ||
			!pricePerToken ||
			machine?.transactionState.steps.checked
		)
			return;

		fetchSteps();
	}, [pricePerToken]);

	return {
		transactionState: machine?.transactionState,
		approve,
		execute,
		fetchSteps,
	};
}
