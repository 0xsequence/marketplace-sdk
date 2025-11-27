import type { Address } from '@0xsequence/api-client';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '../../../types';
import { CollectionStatus } from '../../_internal';
import { collectionMarketDetailQueryOptions } from '../../queries/collection/market-detail';
import { useConfig } from '../config/useConfig';

export type UseCollectionMarketDetailPollingParams = {
	collectionAddress: Address;
	chainId: number;
	query?: {
		enabled?: boolean;
	};
};

const INITIAL_POLLING_INTERVAL = 2000; // 2 seconds
const MAX_POLLING_INTERVAL = 30000; // 30 seconds
const MAX_ATTEMPTS = 30;

const isTerminalState = (status: CollectionStatus): boolean => {
	return [
		CollectionStatus.active,
		CollectionStatus.failed,
		CollectionStatus.inactive,
		CollectionStatus.incompatible_type,
	].includes(status);
};

export const collectionMarketDetailPollingOptions = (
	args: UseCollectionMarketDetailPollingParams,
	config: SdkConfig,
) => {
	return queryOptions({
		...collectionMarketDetailQueryOptions({ ...args, config }),
		refetchInterval: (query) => {
			const data = query.state.data;
			if (data && isTerminalState(data.status)) {
				return false;
			}

			// Calculate exponential backoff interval
			const currentAttempt = (query.state.dataUpdateCount || 0) + 1;
			if (currentAttempt >= MAX_ATTEMPTS) {
				return false;
			}

			const interval = Math.min(
				INITIAL_POLLING_INTERVAL * 1.5 ** currentAttempt,
				MAX_POLLING_INTERVAL,
			);

			return interval;
		},
		refetchOnWindowFocus: false,
		retry: false,
		enabled: args.query?.enabled ?? true,
	});
};

export const useCollectionMarketDetailPolling = (
	args: UseCollectionMarketDetailPollingParams,
) => {
	const config = useConfig();
	return useQuery(collectionMarketDetailPollingOptions(args, config));
};
