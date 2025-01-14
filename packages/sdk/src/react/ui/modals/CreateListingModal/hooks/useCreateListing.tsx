import { useEffect } from 'react';
import { Observable } from '@legendapp/state';
import { useGetTokenApprovalData } from './useGetTokenApproval';
import { ListingInput } from '../../../../_internal/transaction-machine/execute-transaction';
import { OrderbookKind, TransactionSteps } from '../../../../_internal';
import { ModalCallbacks } from '../../_internal/types';
import { useTransactionSteps } from './useTransactionSteps';

interface UseCreateListingArgs {
	listingInput: ListingInput;
	chainId: string;
	collectionAddress: string;
	orderbookKind?: OrderbookKind;
	callbacks?: ModalCallbacks;
	closeMainModal: () => void;
	steps$: Observable<TransactionSteps>;
}

export const useCreateListing = ({
	listingInput,
	chainId,
	collectionAddress,
	orderbookKind = OrderbookKind.sequence_marketplace_v2,
	steps$,
	callbacks,
	closeMainModal,
}: UseCreateListingArgs) => {
	const { data: tokenApproval, isLoading: tokenApprovalIsLoading } =
		useGetTokenApprovalData({
			chainId,
			tokenId: listingInput.listing.tokenId,
			collectionAddress,
			currencyAddress: listingInput.listing.currencyAddress,
			contractType: listingInput.contractType,
			orderbook: orderbookKind,
		});

	useEffect(() => {
		if (tokenApproval?.step && !tokenApprovalIsLoading) {
			steps$.approval.isExist.set(true);
		}
	}, [tokenApproval?.step, tokenApprovalIsLoading]);

	const { generatingSteps, executeApproval, createListing } =
		useTransactionSteps({
			listingInput,
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
		createListing,
		tokenApprovalStepExists: tokenApproval?.step !== null,
		tokenApprovalIsLoading,
	};
};
