import type { Observable } from '@legendapp/state';
import { useEffect } from 'react';
import type { OrderbookKind } from '../../../../../types';
import type { TransactionSteps } from '../../../../_internal';
import type { OfferInput } from '../../../../_internal/transaction-machine/types';
import type { ModalCallbacks } from '../../_internal/types';
import { useGetTokenApprovalData } from './useGetTokenApproval';
import { useTransactionSteps } from './useTransactionSteps';

interface UseMakeOfferArgs {
	offerInput: OfferInput;
	chainId: string;
	collectionAddress: string;
	orderbookKind: OrderbookKind;
	callbacks?: ModalCallbacks;
	closeMainModal: () => void;
	steps$: Observable<TransactionSteps>;
}

export const useMakeOffer = ({
	offerInput,
	chainId,
	collectionAddress,
	orderbookKind,
	callbacks,
	closeMainModal,
	steps$,
}: UseMakeOfferArgs) => {
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
			steps$.approval.exist.set(true);
		}
	}, [tokenApproval?.step, tokenApprovalIsLoading]);

	const { generatingSteps, executeApproval, makeOffer } = useTransactionSteps({
		offerInput,
		chainId,
		collectionAddress,
		orderbookKind,
		callbacks,
		closeMainModal,
		steps$,
	});

	return {
		isLoading: generatingSteps,
		executeApproval,
		makeOffer,
		tokenApprovalStepExists: tokenApproval?.step !== null,
		tokenApprovalIsLoading,
	};
};
