import { type ContractType, type Price, StepType } from '../../types';
import { dateToUnixTime } from '../../utils/date';
import {
	type ListingInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import {
	type UseTransactionMachineConfig,
	useTransactionMachine,
} from '../_internal/transaction-machine/useTransactionMachine';
import type { ModalCallbacks } from '../ui/modals/_internal/types';

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
		transactionInput: {
			type: TransactionType.LISTING,
			props: {
				listing: listingProps,
				contractType: collectionType as ContractType,
			},
		},
		collectionAddress,
		chainId,
		collectibleId,
		// no erc20 token approval needed, to move and transfer erc721s or erc1155s approval is needed
		fetchStepsOnInitialize: true,
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
			type: TransactionType.LISTING,
			props: {
				listing: listingProps,
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
