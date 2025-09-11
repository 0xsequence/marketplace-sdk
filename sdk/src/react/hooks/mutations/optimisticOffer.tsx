import type { Address } from 'viem';
import type { Order } from '../../_internal';
import { getQueryClient } from '../../_internal';
import type { ListCollectiblesQueryOptions } from '../../queries/listCollectibles';
import {
	findListCollectiblesQueryParams,
	invalidateRelatedOfferQueries,
	updateListCollectiblesWithOffer,
} from '../../utils/optimisticUpdates';

export interface OptimisticOfferMutationParams {
	collectionAddress: Address;
	chainId: number;
	collectibleId: string;
	offer: Partial<Order>;
}

// Utility function to apply optimistic offer updates across all relevant listCollectibles caches
export function applyOptimisticOfferUpdate(
	params: OptimisticOfferMutationParams,
) {
	const queryClient = getQueryClient();

	const relevantQueries = findListCollectiblesQueryParams(
		queryClient,
		params.collectionAddress,
		params.chainId,
	);

	// Store rollback functions for each query that gets updated
	const rollbackFunctions: Array<() => void> = [];

	for (const queryData of relevantQueries) {
		if (queryData?.params) {
			const rollback = updateListCollectiblesWithOffer(
				queryClient,
				queryData.params as Omit<ListCollectiblesQueryOptions, 'query'>,
				{
					collectibleId: params.collectibleId,
					offer: params.offer,
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
			invalidateRelatedOfferQueries(
				queryClient,
				params.collectibleId,
				params.collectionAddress,
				params.chainId,
			);
		},
	};
}
