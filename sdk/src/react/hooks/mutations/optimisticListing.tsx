import type { Address } from 'viem';
import type { Order } from '../../_internal';
import { getQueryClient } from '../../_internal';
import type { ListCollectiblesQueryOptions } from '../../queries/listCollectibles';
import {
	findListCollectiblesQueryParams,
	invalidateRelatedListingQueries,
	updateListCollectiblesWithListing,
} from '../../utils/optimisticUpdates';

export interface OptimisticListingMutationParams {
	collectionAddress: Address;
	chainId: number;
	collectibleId: string;
	listing: Partial<Order>;
}

// Utility function to apply optimistic listing updates across all relevant listCollectibles caches
export function applyOptimisticListingUpdate(
	params: OptimisticListingMutationParams,
) {
	const queryClient = getQueryClient();

	const relevantQueries = findListCollectiblesQueryParams(
		queryClient,
		params.collectionAddress,
		params.chainId,
	);

	// Store rollback functions for each query that gets update
	const rollbackFunctions: Array<() => void> = [];

	for (const queryData of relevantQueries) {
		if (queryData?.params) {
			const rollback = updateListCollectiblesWithListing(
				queryClient,
				queryData.params as Omit<ListCollectiblesQueryOptions, 'query'>,
				{
					collectibleId: params.collectibleId,
					listing: params.listing,
				},
			);
			rollbackFunctions.push(rollback);
		}
	}

	return {
		rollback: () => {
			for (const rollback of rollbackFunctions) {
				rollback();
			}
		},
		updateRelatedQueries: () => {
			invalidateRelatedListingQueries(
				queryClient,
				params.collectibleId,
				params.collectionAddress,
				params.chainId,
			);
		},
	};
}
