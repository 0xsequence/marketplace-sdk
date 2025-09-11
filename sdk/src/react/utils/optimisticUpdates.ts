import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { Page } from '../../types';
import { compareAddress } from '../../utils';
import type {
	CollectibleOrder,
	ListCollectiblesReturn,
	Order,
} from '../_internal';
import { collectableKeys } from '../_internal';
import type { ListCollectiblesQueryOptions } from '../queries/listCollectibles';

export interface OptimisticOfferUpdate {
	collectibleId: string;
	offer: Partial<Order>;
}

export interface OptimisticListingUpdate {
	collectibleId: string;
	listing: Partial<Order>;
}

/**
 * Optimistically updates the listCollectibles cache when a new offer is made
 * @param queryClient - The React Query client
 * @param params - Query parameters to identify the correct cache entry
 * @param update - The offer update to apply
 * @returns A function to rollback the optimistic update
 */
export function updateListCollectiblesWithOffer(
	queryClient: QueryClient,
	params: Omit<ListCollectiblesQueryOptions, 'query'>,
	update: OptimisticOfferUpdate,
) {
	const queryKey = [...collectableKeys.lists, params];

	// Take a snapshot of the current data for rollback
	const previousData =
		queryClient.getQueryData<InfiniteData<ListCollectiblesReturn, Page>>(
			queryKey,
		);

	if (!previousData) {
		return () => {};
	}

	// Cancel any outgoing queries for this cache entry
	queryClient.cancelQueries({ queryKey });

	// Apply the optimistic update
	queryClient.setQueryData<InfiniteData<ListCollectiblesReturn, Page>>(
		queryKey,
		(oldData) => {
			if (!oldData) return oldData;

			return {
				...oldData,
				pages: oldData.pages.map((page) => ({
					...page,
					collectibles: page.collectibles.map(
						(collectible: CollectibleOrder) => {
							if (collectible.metadata.tokenId === update.collectibleId) {
								return {
									...collectible,
									// Create new offer if none exists, or merge with existing offer
									offer: collectible.offer
										? { ...collectible.offer, ...update.offer }
										: ({ ...update.offer } as Order),
								};
							}
							return collectible;
						},
					),
				})),
			};
		},
	);

	return () => {
		queryClient.setQueryData(queryKey, previousData);
	};
}

/**
 * Optimistically updates the listCollectibles cache when a new listing is created
 * @param queryClient - The React Query client
 * @param params - Query parameters to identify the correct cache entry
 * @param update - The listing update to apply
 * @returns A function to rollback the optimistic update
 */
export function updateListCollectiblesWithListing(
	queryClient: QueryClient,
	params: Omit<ListCollectiblesQueryOptions, 'query'>,
	update: OptimisticListingUpdate,
) {
	const queryKey = [...collectableKeys.lists, params];

	// Take a snapshot of the current data for rollback
	const previousData =
		queryClient.getQueryData<InfiniteData<ListCollectiblesReturn, Page>>(
			queryKey,
		);

	if (!previousData) {
		return () => {};
	}

	// Cancel any outgoing queries for this cache entry
	queryClient.cancelQueries({ queryKey });

	// Apply the optimistic update
	queryClient.setQueryData<InfiniteData<ListCollectiblesReturn, Page>>(
		queryKey,
		(oldData) => {
			if (!oldData) return oldData;

			return {
				...oldData,
				pages: oldData.pages.map((page) => ({
					...page,
					collectibles: page.collectibles.map(
						(collectible: CollectibleOrder) => {
							if (collectible.metadata.tokenId === update.collectibleId) {
								return {
									...collectible,
									// Create new listing if none exists, or merge with existing listing
									listing: collectible.listing
										? { ...collectible.listing, ...update.listing }
										: ({ ...update.listing } as Order),
								};
							}
							return collectible;
						},
					),
				})),
			};
		},
	);

	return () => {
		queryClient.setQueryData(queryKey, previousData);
	};
}

export function invalidateRelatedOfferQueries(
	queryClient: QueryClient,
	collectibleId: string,
	collectionAddress: string,
	chainId: number,
) {
	queryClient.invalidateQueries({
		queryKey: [
			...collectableKeys.highestOffers,
			{ collectibleId, collectionAddress, chainId },
		],
	});

	queryClient.invalidateQueries({
		queryKey: [
			...collectableKeys.offers,
			{ collectibleId, collectionAddress, chainId },
		],
	});

	queryClient.invalidateQueries({
		queryKey: [
			...collectableKeys.offersCount,
			{ collectibleId, collectionAddress, chainId },
		],
	});
}

export function invalidateRelatedListingQueries(
	queryClient: QueryClient,
	collectibleId: string,
	collectionAddress: string,
	chainId: number,
) {
	queryClient.invalidateQueries({
		queryKey: [
			...collectableKeys.lowestListings,
			{ collectibleId, collectionAddress, chainId },
		],
	});

	queryClient.invalidateQueries({
		queryKey: [
			...collectableKeys.listings,
			{ collectibleId, collectionAddress, chainId },
		],
	});

	queryClient.invalidateQueries({
		queryKey: [
			...collectableKeys.listingsCount,
			{ collectibleId, collectionAddress, chainId },
		],
	});
}

/**
 * Finds all listCollectibles query parameters that match the given collection
 * This helps identify which cache entries need to be updated
 */
export function findListCollectiblesQueryParams(
	queryClient: QueryClient,
	collectionAddress: Address,
	chainId: number,
) {
	const queries = queryClient.getQueriesData({
		queryKey: collectableKeys.lists,
	});

	return queries
		.map(([queryKey, data]) => {
			// Extract params from the query key
			const params = queryKey[2]; // queryKey structure: [...collectableKeys.lists, params]

			if (
				params &&
				typeof params === 'object' &&
				'collectionAddress' in params &&
				'chainId' in params &&
				compareAddress(
					params.collectionAddress as Address,
					collectionAddress,
				) &&
				params.chainId === chainId
			) {
				return { queryKey, params, data };
			}
			return null;
		})
		.filter(Boolean);
}
