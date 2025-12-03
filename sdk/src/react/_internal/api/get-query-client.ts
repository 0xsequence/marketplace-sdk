import {
	defaultShouldDehydrateQuery,
	QueryClient,
} from '@tanstack/react-query';
import { hashFn } from 'wagmi/query';

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
				queryKeyHashFn: hashFn,
			},
			dehydrate: {
				shouldDehydrateQuery: (query) =>
					defaultShouldDehydrateQuery(query) ||
					query.state.status === 'pending',
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
	if (typeof globalThis.document === 'undefined') {
		return makeQueryClient();
	}

	if (!browserQueryClient) browserQueryClient = makeQueryClient();
	return browserQueryClient;
}
