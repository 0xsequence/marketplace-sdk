import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, render as rtlRender } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { mock } from 'wagmi/connectors';
import type { QueryObserverResult } from '@tanstack/react-query';
import { vi } from 'vitest';

const createTestQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				staleTime: 0,
			},
		},
	});

const config = createConfig({
	chains: [mainnet, sepolia],
	connectors: [
		mock({
			accounts: [
				'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
				'0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
				'0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
			],
		}),
	],
	transports: {
		[mainnet.id]: http(),
		[sepolia.id]: http(),
	},
});

/**
 * Creates a mock success response for a React Query result
 * @param data The data to include in the success response
 * @returns A mock QueryObserverResult in success state
 */
export function createSuccessResponse<TData, TError = Error>(
	data: TData,
): QueryObserverResult<TData, TError> {
	return {
		data,
		isLoading: false,
		error: null,
		isError: false,
		isPending: false,
		isLoadingError: false,
		isRefetchError: false,
		isSuccess: true,
		status: 'success',
		isFetching: false,
		isRefetching: false,
		isPlaceholderData: false,
		isPaused: false,
		isStale: false,
		isInitialLoading: false,
		dataUpdatedAt: Date.now(),
		errorUpdatedAt: Date.now(),
		failureCount: 0,
		failureReason: null,
		errorUpdateCount: 0,
		refetch: vi.fn(),
		isFetched: true,
		isFetchedAfterMount: true,
		fetchStatus: 'idle',
		promise: Promise.resolve(data),
	};
}

/**
 * Creates a mock loading response for a React Query result
 * @returns A mock QueryObserverResult in loading state
 */
export function createLoadingResponse<
	TData,
	TError = Error,
>(): QueryObserverResult<TData, TError> {
	return {
		data: undefined,
		error: null,
		isLoading: true,
		isPending: true,
		isSuccess: false,
		status: 'pending',
		isFetching: true,
		isInitialLoading: true,
		isFetched: false,
		isFetchedAfterMount: false,
		fetchStatus: 'fetching',
		isError: false,
		isLoadingError: false,
		isRefetchError: false,
		isRefetching: false,
		isPlaceholderData: false,
		isPaused: false,
		isStale: false,
		dataUpdatedAt: Date.now(),
		errorUpdatedAt: Date.now(),
		failureCount: 0,
		failureReason: null,
		errorUpdateCount: 0,
		refetch: vi.fn(),
		promise: Promise.resolve(undefined) as Promise<TData>,
	};
}

/**
 * Creates a mock error response for a React Query result
 * @param error The error to include in the error response
 * @returns A mock QueryObserverResult in error state
 */
export function createErrorResponse<TData, TError = Error>(
	error: TError,
): QueryObserverResult<TData, TError> {
	return {
		data: undefined,
		error,
		isLoading: false,
		isPending: false,
		isSuccess: false,
		status: 'error',
		isFetching: false,
		isInitialLoading: false,
		isFetched: true,
		isFetchedAfterMount: true,
		fetchStatus: 'idle',
		isError: true,
		isLoadingError: true,
		isRefetchError: false,
		isRefetching: false,
		isPlaceholderData: false,
		isPaused: false,
		isStale: false,
		dataUpdatedAt: Date.now(),
		errorUpdatedAt: Date.now(),
		failureCount: 1,
		failureReason: error,
		errorUpdateCount: 1,
		refetch: vi.fn(),
		promise: Promise.reject(error),
	};
}

export function renderWithClient(
	ui: ReactElement,
	options?: Omit<RenderOptions, 'wrapper'>,
) {
	const testQueryClient = createTestQueryClient();

	const { rerender, ...result } = rtlRender(ui, {
		wrapper: ({ children }) => (
			<WagmiProvider config={config}>
				<QueryClientProvider client={testQueryClient}>
					{children}
				</QueryClientProvider>
			</WagmiProvider>
		),
		...options,
	});

	return {
		...result,
		rerender: (rerenderUi: ReactElement) =>
			rerender(
				<WagmiProvider config={config}>
					<QueryClientProvider client={testQueryClient}>
						{rerenderUi}
					</QueryClientProvider>
				</WagmiProvider>,
			),
	};
}

export function renderHookWithClient<P, R>(
	callback: (props: P) => R,
	options?: Omit<RenderOptions, 'queries'>,
) {
	const testQueryClient = createTestQueryClient();

	return renderHook(callback, {
		wrapper: ({ children }) => (
			<WagmiProvider config={config}>
				<QueryClientProvider client={testQueryClient}>
					{children}
				</QueryClientProvider>
			</WagmiProvider>
		),
		...options,
	});
}

export * from '@testing-library/react';

export { renderWithClient as render };
export { renderHookWithClient as renderHook };
