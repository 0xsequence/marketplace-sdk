import { type ContractType, type Price, StepType } from '../../types';
import { dateToUnixTime } from '../../utils/date';
import {
	type OfferInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import {
	type UseTransactionMachineConfig,
	useTransactionMachine,
} from '../_internal/transaction-machine/useTransactionMachine';
import type { ModalCallbacks } from '../ui/modals/_internal/types';

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
		if (!machine) return;

		await machine.execute({
			type: TransactionType.OFFER,
			props: {
				offer: offerProps,
				contractType: collectionType as ContractType,
			},
		});
	}

	return {
		transactionState: machine?.transactionState,
		approve,
		execute,
	};
}
