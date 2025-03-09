import { server } from '@test';
import { renderHook } from '@test';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mock, useAccount, useConnect, useDisconnect } from 'wagmi';
import { MarketplaceKind, WalletKind } from '../../_internal';
import {
	mockMarketplaceEndpoint,
	mockSteps,
} from '../../_internal/api/__mocks__/marketplace.msw';
import { useGenerateBuyTransaction } from '../useGenerateBuyTransaction';

describe('useGenerateBuyTransaction', () => {
	const defaultArgs = {
		chainId: '1',
		collectionAddress:
			'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as `0x${string}`,
		marketplace: MarketplaceKind.sequence_marketplace_v2,
		ordersData: [
			{
				marketplace: MarketplaceKind.sequence_marketplace_v2,
				orderId: '1',
				quantity: '1',
				price: '1',
				currency: 'ETH',
				currencyAddress:
					'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as `0x${string}`,
				currencyDecimals: 18,
				currencySymbol: 'ETH',
				currencyName: 'Ether',
			},
		],
		walletType: WalletKind.sequence,
		query: {},
	};

	beforeEach(() => {
		vi.clearAllMocks();

		// Mock default steps response with delay to simulate loading state
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateBuyTransaction'), async () => {
				await new Promise((resolve) => setTimeout(resolve, 100)); // Add small delay
				return HttpResponse.json({
					steps: mockSteps,
				});
			}),
		);
	});

	it('should skip query when no address is available', async () => {
		const { result: generateBuyTransactionResult } = renderHook(() =>
			useGenerateBuyTransaction(defaultArgs),
		);
		const { result: disconnectResult } = renderHook(() => useDisconnect());

		// make sure we are disconnected
		await disconnectResult.current.disconnectAsync();

		expect(generateBuyTransactionResult.current.isLoading).toBe(false);
		expect(generateBuyTransactionResult.current.error).toBeNull();
		expect(generateBuyTransactionResult.current.data).toBeUndefined();
	});

	it('should fetch transaction data when wallet is connected', async () => {
		// Setup mock wallet connection
		const mockAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
		const { result: accountResult } = renderHook(() => useAccount());
		const { result: connectResult } = renderHook(() => useConnect());

		await connectResult.current.connectAsync({
			connector: mock({
				accounts: [mockAddress],
			}),
		});

		// Ensure we have a connected wallet
		expect(accountResult.current.address).toBe(mockAddress);

		const { result } = renderHook(() => useGenerateBuyTransaction(defaultArgs));

		// Initial state should be loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for the query to complete
		await vi.waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.error).toBeNull();
		expect(result.current.data).toEqual(mockSteps);
	});

	it('should handle API errors correctly', async () => {
		// Setup mock wallet connection
		const mockAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
		const { result: connectResult } = renderHook(() => useConnect());

		await connectResult.current.connectAsync({
			connector: mock({
				accounts: [mockAddress],
			}),
		});

		// Mock API error response
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateBuyTransaction'), () => {
				return HttpResponse.json(
					{ message: 'Invalid order data' },
					{ status: 400 },
				);
			}),
		);

		const { result } = renderHook(() => useGenerateBuyTransaction(defaultArgs));

		// Initial state should be loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.error).toBeNull();
		expect(result.current.data).toBeUndefined();

		// Wait for the query to complete
		await vi.waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify error state
		expect(result.current.error).toBeTruthy();
		expect(result.current.data).toBeUndefined();
	});

	it('should handle invalid input arguments correctly', async () => {
		// Setup mock wallet connection
		const mockAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
		const { result: connectResult } = renderHook(() => useConnect());

		await connectResult.current.connectAsync({
			connector: mock({
				accounts: [mockAddress],
			}),
		});

		// Create invalid args by omitting required fields and using invalid types
		const invalidArgs = {
			...defaultArgs,
			chainId: 1, // Should be string
			collectionAddress: 'invalid-address', // Invalid address format
			ordersData: [
				{
					...defaultArgs.ordersData[0],
					quantity: 1, // Should be string
					orderId: undefined, // Required field missing
				},
			],
		};

		const { result } = renderHook(() =>
			// @ts-expect-error - Testing runtime validation
			useGenerateBuyTransaction(invalidArgs),
		);

		// Wait for the query to complete
		await vi.waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify validation error state
		expect(result.current.error).toBeTruthy();
		expect(result.current.data).toBeUndefined();
	});
});
