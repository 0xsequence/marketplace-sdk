import type { QueryClient } from '@tanstack/react-query';
import type {
	GetCountOfListingsForCollectibleResponse,
	GetCountOfOffersForCollectibleResponse,
	ListListingsForCollectibleResponse,
	ListOffersForCollectibleResponse,
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
		{ queryKey: ['collectible', 'market-offers-count'], exact: false },
		(oldData: GetCountOfOffersForCollectibleResponse | undefined) => {
			if (!oldData) return 0;
			return Math.max(0, oldData.count - 1);
		},
	);

	// remove the offer with matching orderId
	queryClient.setQueriesData(
		{ queryKey: ['collectible', 'market-offers'], exact: false },
		(oldData: ListOffersForCollectibleResponse | undefined) => {
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
			queryKey: ['collectible', 'market-highest-offer'],
			exact: false,
			predicate: (query) => !query.meta?.persistent,
		});
	}, 2 * SECOND);

	queryClient.setQueriesData(
		{ queryKey: ['collectible', 'market-listings-count'], exact: false },
		(oldData: GetCountOfListingsForCollectibleResponse | undefined) => {
			if (!oldData) return 0;
			return Math.max(0, oldData.count - 1);
		},
	);

	queryClient.setQueriesData(
		{ queryKey: ['collectible', 'market-listings'], exact: false },
		(oldData: ListListingsForCollectibleResponse | undefined) => {
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
			queryKey: ['collectible', 'market-lowest-listing'],
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
		queryKey: ['collectible', 'market-offers'],
		exact: false,
	});

	queryClient.invalidateQueries({
		queryKey: ['collectible', 'market-offers-count'],
		exact: false,
	});

	queryClient.invalidateQueries({
		queryKey: ['collectible', 'market-listings'],
		exact: false,
	});

	queryClient.invalidateQueries({
		queryKey: ['collectible', 'market-listings-count'],
		exact: false,
	});

	queryClient.invalidateQueries({
		queryKey: ['collectible', 'market-highest-offer'],
		exact: false,
	});

	queryClient.invalidateQueries({
		queryKey: ['collectible', 'market-lowest-listing'],
		exact: false,
	});
};
