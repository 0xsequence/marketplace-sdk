import type { QueryClient } from '@tanstack/react-query';
import {
	collectableKeys,
	type GetCountOfListingsForCollectibleReturn,
	type GetCountOfOffersForCollectibleReturn,
	type ListListingsForCollectibleReturn,
	type ListOffersForCollectibleReturn,
} from '../../_internal';

const SECOND = 1000;

interface OptimisticCancelUpdatesParams {
	orderId: string;
	queryClient: QueryClient;
}

export const updateQueriesOnCancel = ({
	orderId,
	queryClient,
}: OptimisticCancelUpdatesParams) => {
	queryClient.setQueriesData(
		{ queryKey: collectableKeys.offersCount, exact: false },
		(oldData: GetCountOfOffersForCollectibleReturn | undefined) => {
			if (!oldData) return 0;
			return Math.max(0, oldData.count - 1);
		},
	);

	// remove the offer with matching orderId
	queryClient.setQueriesData(
		{ queryKey: collectableKeys.offers, exact: false },
		(oldData: ListOffersForCollectibleReturn | undefined) => {
			if (!oldData || !oldData.offers) return oldData;
			return {
				...oldData,
				offers: oldData.offers.filter((offer) => offer.orderId !== orderId),
			};
		},
	);

	// 2 seconds is enough time for new data to be fetched
	setTimeout(() => {
		queryClient.invalidateQueries({
			queryKey: collectableKeys.highestOffers,
			exact: false,
			predicate: (query) => !query.meta?.persistent,
		});
	}, 2 * SECOND);

	queryClient.setQueriesData(
		{ queryKey: collectableKeys.listingsCount, exact: false },
		(oldData: GetCountOfListingsForCollectibleReturn | undefined) => {
			if (!oldData) return 0;
			return Math.max(0, oldData.count - 1);
		},
	);

	queryClient.setQueriesData(
		{ queryKey: collectableKeys.listings, exact: false },
		(oldData: ListListingsForCollectibleReturn | undefined) => {
			if (!oldData || !oldData.listings) return oldData;
			return {
				...oldData,
				listings: oldData.listings.filter(
					(listing) => listing.orderId !== orderId,
				),
			};
		},
	);

	// 2 seconds is enough time for new data to be fetched
	setTimeout(() => {
		queryClient.invalidateQueries({
			queryKey: collectableKeys.lowestListings,
			exact: false,
		});
	}, 2 * SECOND);
};

export const invalidateQueriesOnCancel = ({
	queryClient,
}: {
	queryClient: QueryClient;
}) => {
	queryClient.invalidateQueries({
		queryKey: collectableKeys.offers,
		exact: false,
	});

	queryClient.invalidateQueries({
		queryKey: collectableKeys.offersCount,
		exact: false,
	});

	queryClient.invalidateQueries({
		queryKey: collectableKeys.listings,
		exact: false,
	});

	queryClient.invalidateQueries({
		queryKey: collectableKeys.listingsCount,
		exact: false,
	});

	queryClient.invalidateQueries({
		queryKey: collectableKeys.highestOffers,
		exact: false,
	});

	queryClient.invalidateQueries({
		queryKey: collectableKeys.lowestListings,
		exact: false,
	});
};
