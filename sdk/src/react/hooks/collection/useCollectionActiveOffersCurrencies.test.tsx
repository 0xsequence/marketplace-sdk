import { MarketplaceMocks } from '@0xsequence/api-client';
import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import type { UseCollectionActiveOffersCurrenciesParams } from './useCollectionActiveOffersCurrencies';
import { useCollectionActiveOffersCurrencies } from './useCollectionActiveOffersCurrencies';

const { mockMarketplaceEndpoint } = MarketplaceMocks;

describe('useCollectionActiveOffersCurrencies', () => {
	const defaultArgs: UseCollectionActiveOffersCurrenciesParams = {
		chainId: 1,
		collectionAddress: zeroAddress,
	};

	it('should fetch active offers currencies successfully', async () => {
		const mockCurrencies = [
			{
				contractAddress: '0x1234567890123456789012345678901234567890',
				decimals: 18,
				name: 'Test Coin',
				symbol: 'TEST',
			},
		];

		server.use(
			http.post(
				mockMarketplaceEndpoint('GetCollectionActiveOffersCurrencies'),
				() => {
					return HttpResponse.json({ currencies: mockCurrencies });
				},
			),
		);

		const { result } = renderHook(() =>
			useCollectionActiveOffersCurrencies(defaultArgs),
		);

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.data).toEqual(mockCurrencies);
		});

		// Verify the data matches our mock
		expect(result.current.data).toEqual(mockCurrencies);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		server.use(
			http.post(
				mockMarketplaceEndpoint('GetCollectionActiveOffersCurrencies'),
				() => {
					return HttpResponse.json(
						{ error: { message: 'Failed to fetch currencies' } },
						{ status: 500 },
					);
				},
			),
		);

		const { result } = renderHook(() =>
			useCollectionActiveOffersCurrencies(defaultArgs),
		);

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const mockCurrencies1 = [
			{
				contractAddress: '0x1234567890123456789012345678901234567890',
				decimals: 18,
				name: 'Test Coin 1',
				symbol: 'TEST1',
			},
		];
		const mockCurrencies2 = [
			{
				contractAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
				decimals: 6,
				name: 'Test Coin 2',
				symbol: 'TEST2',
			},
		];

		let requestedChainId = '';

		server.use(
			http.post(
				mockMarketplaceEndpoint('GetCollectionActiveOffersCurrencies'),
				async ({ request }) => {
					const body = (await request.json()) as any;
					requestedChainId = body.chainId;
					return HttpResponse.json({
						currencies:
							body.chainId === '1' ? mockCurrencies1 : mockCurrencies2,
					});
				},
			),
		);

		const { result, rerender } = renderHook(
			(args: UseCollectionActiveOffersCurrenciesParams = defaultArgs) =>
				useCollectionActiveOffersCurrencies(args),
		);

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.data).toEqual(mockCurrencies1);
		});
		expect(requestedChainId).toBe('1');

		// Change args and rerender
		const newArgs = {
			...defaultArgs,
			chainId: 137,
		};

		rerender(newArgs);

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toEqual(mockCurrencies2);
		});
		expect(requestedChainId).toBe('137');
	});

	it('should not fetch if required params are missing', async () => {
		const { result } = renderHook(() =>
			useCollectionActiveOffersCurrencies({
				...defaultArgs,
				chainId: undefined,
			} as any),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
	});
});
