'use client';

import type { Observable } from '@legendapp/state';
import { useEffect } from 'react';
import type { Address } from 'viem';
import { OrderbookKind } from '../../../../../types';
import type { TransactionSteps } from '../../../../_internal';
import type { OfferInput } from '../../../../_internal/types';
import type { ModalCallbacks } from '../../_internal/types';
import { useGetTokenApprovalData } from './useGetTokenApproval';
import { useTransactionSteps } from './useTransactionSteps';

interface UseMakeOfferArgs {
	offerInput: OfferInput;
	chainId: number;
	collectionAddress: Address;
	orderbookKind?: OrderbookKind;
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
			orderbook: orderbookKind || OrderbookKind.sequence_marketplace_v2,
		});

	useEffect(() => {
		if (!tokenApprovalIsLoading) {
			steps$.approval.exist.set(!!tokenApproval?.step);
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
