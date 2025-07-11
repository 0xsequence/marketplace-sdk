import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '../../../../../types';
import { CollectionStatus } from '../../../_internal';
import { useConfig } from '../../config/useConfig';
import { collectionDetailsQueryOptions } from '../../data/collections/useCollectionDetails';

type UseCollectionDetailsPolling = {
	collectionAddress: string;
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

export const collectionDetailsPollingOptions = (
	args: UseCollectionDetailsPolling,
	config: SdkConfig,
) => {
	return queryOptions({
		...collectionDetailsQueryOptions({ ...args, config }),
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

export const useCollectionDetailsPolling = (
	args: UseCollectionDetailsPolling,
) => {
	const config = useConfig();
	return useQuery(collectionDetailsPollingOptions(args, config));
};
