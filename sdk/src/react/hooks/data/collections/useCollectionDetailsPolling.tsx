import { queryOptions, useQuery } from '@tanstack/react-query';
import type { SdkConfig } from '../../../../types';
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

/**
 * Polls collection details until a terminal state is reached
 *
 * This hook fetches collection details with automatic polling that continues
 * until the collection reaches a terminal state (active, failed, inactive, or
 * incompatible_type). It uses exponential backoff to reduce server load while
 * waiting for collection processing to complete.
 *
 * @param args - Configuration for polling
 * @param args.collectionAddress - The collection contract address to poll
 * @param args.chainId - The blockchain network ID
 * @param args.query - Optional query configuration
 * @param args.query.enabled - Whether to enable polling (default: true)
 *
 * @returns React Query result with collection details
 * @returns returns.data - Collection details when loaded
 * @returns returns.isLoading - True during initial fetch
 * @returns returns.isFetching - True during any fetch (including refetch)
 * @returns returns.error - Error object if fetching fails
 *
 * @example
 * Basic usage for new collection:
 * ```typescript
 * const { data: collection, isLoading } = useCollectionDetailsPolling({
 *   collectionAddress: '0x...',
 *   chainId: 137
 * });
 *
 * if (isLoading) return <div>Loading collection...</div>;
 *
 * if (collection?.status === CollectionStatus.active) {
 *   console.log('Collection is ready!');
 * } else if (collection?.status === CollectionStatus.processing) {
 *   console.log('Still processing...');
 * }
 * ```
 *
 * @example
 * Conditional polling:
 * ```typescript
 * const [shouldPoll, setShouldPoll] = useState(true);
 *
 * const { data: collection } = useCollectionDetailsPolling({
 *   collectionAddress: newCollectionAddress,
 *   chainId: 1,
 *   query: {
 *     enabled: shouldPoll && !!newCollectionAddress
 *   }
 * });
 *
 * // Stop polling once active
 * useEffect(() => {
 *   if (collection?.status === CollectionStatus.active) {
 *     setShouldPoll(false);
 *     onCollectionReady(collection);
 *   }
 * }, [collection?.status]);
 * ```
 *
 * @remarks
 * - Polling starts at 2-second intervals with exponential backoff
 * - Maximum polling interval is 30 seconds
 * - Stops after 30 attempts or reaching a terminal state
 * - Terminal states: active, failed, inactive, incompatible_type
 * - Non-terminal states (processing, validating) continue polling
 * - Window focus refetching is disabled to prevent interruption
 * - Retry on error is disabled to prevent infinite loops
 *
 * @see {@link CollectionStatus} - Enum of possible collection statuses
 * @see {@link useCollectionDetails} - Non-polling version of this hook
 */
export const useCollectionDetailsPolling = (
	args: UseCollectionDetailsPolling,
) => {
	const config = useConfig();
	return useQuery(collectionDetailsPollingOptions(args, config));
};
