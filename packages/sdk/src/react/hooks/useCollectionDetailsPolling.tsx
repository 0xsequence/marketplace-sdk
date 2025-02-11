import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
import { CollectionStatus } from '../_internal/api/marketplace.gen';
import { useConfig } from './useConfig';
import { collectionDetailsOptions } from './useCollectionDetails';

type UseCollectionDetailsPolling = {
	collectionAddress: string;
	chainId: number;
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
		...collectionDetailsOptions(args, config),
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
				INITIAL_POLLING_INTERVAL * Math.pow(1.5, currentAttempt),
				MAX_POLLING_INTERVAL,
			);

			return interval;
		},
		refetchOnWindowFocus: false,
		retry: false,
	});
};

export const useCollectionDetailsPolling = (
	args: UseCollectionDetailsPolling,
) => {
	const config = useConfig();
	return useQuery(collectionDetailsPollingOptions(args, config));
};
