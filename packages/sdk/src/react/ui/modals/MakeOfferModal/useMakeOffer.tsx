import { Observable } from '@legendapp/state';
import { OrderbookKind } from '../../../../types';
import { OfferInput } from '../../../_internal/transaction-machine/execute-transaction';
import { useWallet } from '../../../_internal/transaction-machine/useWallet';
import { ModalCallbacks } from '../_internal/types';
import { useGetTokenApprovalData } from './useGetTokenApproval';
import { useTransactionSteps } from './useTransactionSteps';
import { useEffect } from 'react';
import { TransactionSteps } from './store';

interface UseMakeOfferArgs {
	offerInput: OfferInput;
	chainId: string;
	collectionAddress: string;
	orderbookKind?: OrderbookKind;
	callbacks?: ModalCallbacks;
	closeMainModal: () => void;
	steps$: Observable<TransactionSteps>;
}

export const useMakeOffer = ({
	offerInput,
	chainId,
	collectionAddress,
	orderbookKind = OrderbookKind.sequence_marketplace_v2,
	callbacks,
	closeMainModal,
	steps$,
}: UseMakeOfferArgs) => {
	const { wallet, isLoading: walletLoading } = useWallet();
	const { data: tokenApproval, isLoading: tokenApprovalIsLoading } =
		useGetTokenApprovalData({
			chainId,
			tokenId: offerInput.offer.tokenId,
			collectionAddress,
			currencyAddress: offerInput.offer.currencyAddress,
			contractType: offerInput.contractType,
			orderbook: orderbookKind,
		});

	useEffect(() => {
		if (tokenApproval?.step && !tokenApprovalIsLoading) {
			steps$.approval.isExist.set(true);
		}
	}, [tokenApproval?.step, tokenApprovalIsLoading]);

	const { generatingSteps, executeApproval, executeTransaction } =
		useTransactionSteps({
			offerInput,
			chainId,
			collectionAddress,
			orderbookKind,
			wallet,
			callbacks,
			closeMainModal,
			steps$,
		});

	return {
		isLoading: walletLoading || generatingSteps,
		executeApproval,
		executeTransaction,
		tokenApprovalStepExists: tokenApproval?.step !== null,
		tokenApprovalIsLoading,
	};
};
