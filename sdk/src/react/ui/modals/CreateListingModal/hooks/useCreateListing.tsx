'use client';

import type { Observable } from '@legendapp/state';
import { useEffect } from 'react';
import type { Address } from 'viem';
import type { MarketCollection } from '../../../../../types';
import { compareAddress } from '../../../../../utils';
import {
	type ContractType,
	OrderbookKind,
	type TransactionSteps,
} from '../../../../_internal';
import { useMarketplaceConfig } from '../../../../hooks';
import type { ModalCallbacks } from '../../_internal/types';
import { useGetTokenApprovalData } from './useGetTokenApproval';
import { useTransactionSteps } from './useTransactionSteps';

// Internal type for modal state - uses bigint for type safety
export interface CreateListingInput {
	contractType: ContractType;
	listing: {
		tokenId: bigint;
		quantity: bigint;
		expiry: string;
		currencyAddress: string;
		pricePerToken: bigint;
	};
}

interface UseCreateListingArgs {
	listingInput: CreateListingInput;
	chainId: number;
	collectionAddress: Address;
	orderbookKind?: OrderbookKind;
	callbacks?: ModalCallbacks;
	closeMainModal: () => void;
	steps$: Observable<TransactionSteps>;
}

export const useCreateListing = ({
	listingInput,
	chainId,
	collectionAddress,
	orderbookKind,
	steps$,
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

	useEffect(() => {
		if (tokenApproval?.step && !tokenApprovalIsLoading) {
			steps$.approval.exist.set(true);
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
		isError,
		error,
	};
};
