'use client';

import type { Observable } from '@legendapp/state';
import { useEffect } from 'react';
import type { Address } from 'viem';
import type { MarketplaceKind, TransactionSteps } from '../../../../_internal';
import type { ModalCallbacks } from '../../_internal/types';
import { useGetTokenApprovalData } from './useGetTokenApproval';
import { useTransactionSteps } from './useTransactionSteps';

export type SellOrder = {
	orderId: string;
	quantity: string;
	pricePerToken: string;
	currencyAddress: string;
};

interface UseSellArgs {
	collectibleId: string;
	chainId: number;
	collectionAddress: Address;
	marketplace: MarketplaceKind;
	ordersData: Array<SellOrder>;
	callbacks?: ModalCallbacks;
	closeMainModal: () => void;
	steps$: Observable<TransactionSteps>;
}

export const useSell = ({
	collectibleId,
	chainId,
	collectionAddress,
	marketplace,
	ordersData,
	callbacks,
	closeMainModal,
	steps$,
}: UseSellArgs) => {
	const {
		data: tokenApproval,
		isLoading: tokenApprovalIsLoading,
		isError,
		error,
	} = useGetTokenApprovalData({
		chainId,
		collectionAddress,
		ordersData,
		marketplace,
	});

	useEffect(() => {
		if (tokenApproval?.step && !tokenApprovalIsLoading) {
			steps$.approval.exist.set(true);
		}
	}, [tokenApproval?.step, tokenApprovalIsLoading]);

	const { generatingSteps, executeApproval, sell } = useTransactionSteps({
		collectibleId,
		chainId,
		collectionAddress,
		marketplace,
		ordersData,
		callbacks,
		closeMainModal,
		steps$,
	});

	return {
		isLoading: generatingSteps,
		executeApproval,
		sell,
		tokenApprovalStepExists: tokenApproval?.step !== null,
		tokenApprovalIsLoading,
		isError,
		error,
	};
};
