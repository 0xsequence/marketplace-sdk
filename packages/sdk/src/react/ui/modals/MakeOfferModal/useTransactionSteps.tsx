import { StepType } from '../../../_internal';
import { useGenerateOfferTransaction } from '../../../hooks/useGenerateOfferTransaction';
import { OrderbookKind } from '../../../../types';
import { ModalCallbacks } from '../_internal/types';
import {
	OfferInput,
	TransactionType,
} from '../../../_internal/transaction-machine/execute-transaction';
import { WalletInstance } from '../../../_internal/transaction-machine/wallet';
import { useTransactionStatusModal } from '../_internal/components/transactionStatusModal';
import { Address } from 'viem';
import { Observable } from '@legendapp/state';
import { TransactionSteps } from './store';

export type ExecutionState = 'approval' | 'offer' | null;

interface UseTransactionStepsArgs {
	offerInput: OfferInput;
	chainId: string;
	collectionAddress: string;
	orderbookKind?: OrderbookKind;
	wallet: WalletInstance | null;
	callbacks?: ModalCallbacks;
	closeMainModal: () => void;
	steps$: Observable<TransactionSteps>;
}

export const useTransactionSteps = ({
	offerInput,
	chainId,
	collectionAddress,
	orderbookKind = OrderbookKind.sequence_marketplace_v2,
	wallet,
	callbacks,
	closeMainModal,
	steps$,
}: UseTransactionStepsArgs) => {
	const expiry = new Date(Number(offerInput.offer.expiry) * 1000);
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const { generateOfferTransactionAsync, isPending: generatingSteps } =
		useGenerateOfferTransaction({
			chainId,
			onSuccess: (steps) => {
				if (!steps) return;
			},
		});

	const getOfferSteps = async () => {
		if (!wallet) return;

		try {
			const address = await wallet.address();

			const steps = await generateOfferTransactionAsync({
				collectionAddress,
				maker: address,
				walletType: wallet.walletKind,
				contractType: offerInput.contractType,
				orderbook: orderbookKind,
				offer: {
					...offerInput.offer,
					expiry,
				},
			});

			return steps;
		} catch (error) {
			if (callbacks?.onError) {
				callbacks.onError(error as Error);
			} else {
				console.debug('onError callback not provided:', error);
			}
			throw error;
		}
	};

	const executeApproval = async () => {
		if (!wallet) return;

		try {
			steps$.approval.isExecuting.set(true);
			const approvalStep = await getOfferSteps().then((steps) =>
				steps?.find((step) => step.id === StepType.tokenApproval),
			);

			await wallet.handleSendTransactionStep(
				Number(chainId),
				approvalStep as any,
			);

			steps$.approval.isExecuting.set(false);
		} catch (error) {
			steps$.approval.isExecuting.set(false);
			throw error;
		}
	};

	const executeTransaction = async () => {
		if (!wallet) return;
		try {
			steps$.transaction.isExecuting.set(true);
			const transactionStep = await getOfferSteps().then((steps) =>
				steps?.find((step) => step.id === StepType.createOffer),
			);

			const hash = await wallet.handleSendTransactionStep(
				Number(chainId),
				transactionStep as any,
			);

			closeMainModal();

			showTransactionStatusModal({
				type: TransactionType.OFFER,
				collectionAddress: collectionAddress as Address,
				chainId,
				collectibleId: offerInput.offer.tokenId,
				hash,
				callbacks,
			});

			steps$.transaction.isExecuting.set(false);
		} catch (error) {
			steps$.transaction.isExecuting.set(false);
			throw error;
		}
	};

	return {
		generatingSteps,
		executeApproval,
		executeTransaction,
	};
};
