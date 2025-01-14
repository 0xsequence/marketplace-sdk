import { Observable } from '@legendapp/state';
import { ModalCallbacks } from '../../_internal/types';
import { useGetTokenApprovalData } from './useGetTokenApproval';
import { useTransactionSteps } from './useTransactionSteps';
import { useEffect } from 'react';
import {
	MarketplaceKind,
	OrderData,
	TransactionSteps,
} from '../../../../_internal';

interface UseSellArgs {
	collectibleId: string;
	chainId: string;
	collectionAddress: string;
	marketplace: MarketplaceKind;
	ordersData: Array<OrderData>;
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
	const { data: tokenApproval, isLoading: tokenApprovalIsLoading } =
		useGetTokenApprovalData({
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
	};
};
