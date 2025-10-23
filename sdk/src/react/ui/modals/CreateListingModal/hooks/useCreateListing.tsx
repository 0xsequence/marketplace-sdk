'use client';

import type { Address } from 'viem';
import type { MarketCollection } from '../../../../../types/new-marketplace-types';
import { compareAddress } from '../../../../../utils';
import {
	type ContractType,
	type CreateReq,
	OrderbookKind,
} from '../../../../_internal';
import { useMarketplaceConfig } from '../../../../hooks';
import type { ModalCallbacks } from '../../_internal/types';
import { useGetTokenApprovalData } from './useGetTokenApproval';
import { useTransactionSteps } from './useTransactionSteps';

export interface ListingInput {
	contractType: ContractType;
	listing: CreateReq;
}

interface UseCreateListingArgs {
	listingInput: ListingInput;
	chainId: number;
	collectionAddress: Address;
	orderbookKind?: OrderbookKind;
	callbacks?: ModalCallbacks;
	closeMainModal: () => void;
}

export const useCreateListing = ({
	listingInput,
	chainId,
	collectionAddress,
	orderbookKind,
	callbacks,
	closeMainModal,
}: UseCreateListingArgs) => {
	const { data: marketplaceConfig, isLoading: marketplaceIsLoading } =
		useMarketplaceConfig();

	const collectionConfig = marketplaceConfig?.market.collections.find((c) =>
		compareAddress(c.itemsAddress, collectionAddress),
	) as MarketCollection;

	orderbookKind =
		orderbookKind ??
		collectionConfig?.destinationMarketplace ??
		OrderbookKind.sequence_marketplace_v2;

	const {
		data: tokenApproval,
		isLoading: tokenApprovalIsLoading,
		isError,
		error,
	} = useGetTokenApprovalData({
		chainId,
		tokenId: listingInput.listing.tokenId,
		collectionAddress,
		currencyAddress: listingInput.listing.currencyAddress,
		contractType: listingInput.contractType,
		orderbook: orderbookKind,
		query: {
			enabled: !marketplaceIsLoading,
		},
	});

	const {
		generatingSteps,
		executeApproval,
		createListing,
		approvalExecuting,
		createListingExecuting,
	} = useTransactionSteps({
		listingInput,
		chainId,
		collectionAddress,
		orderbookKind,
		callbacks,
		closeMainModal,
	});

	// Derive approval needed from tokenApproval data
	const approvalNeeded = tokenApproval?.step != null;

	return {
		isLoading: generatingSteps,
		executeApproval,
		createListing,
		approvalNeeded,
		approvalExecuting,
		createListingExecuting,
		tokenApprovalIsLoading,
		isError,
		error,
	};
};
