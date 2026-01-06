import * as MarketplaceMocks from '@0xsequence/api-client/mocks/marketplace';
import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { mockMarketplaceEndpoint } = MarketplaceMocks;

import { ContractType, OrderbookKind } from '@0xsequence/api-client';
import type { CreateReqWithDateExpiry } from './useGenerateListingTransaction';
import { useGenerateListingTransaction } from './useGenerateListingTransaction';

describe('useGenerateListingTransaction', () => {
	const mockOnSuccess = vi.fn();

	afterEach(() => {
		vi.clearAllMocks();
	});

	const mockListing: CreateReqWithDateExpiry = {
		tokenId: 1n,
		quantity: 1n,
		expiry: new Date('2024-12-31'),
		currencyAddress: zeroAddress,
		pricePerToken: 1000000000000000000n,
	};

	const mockTransactionProps = {
		collectionAddress: zeroAddress,
		owner: zeroAddress,
		contractType: ContractType.ERC721,
		orderbook: OrderbookKind.sequence_marketplace_v2,
		listing: mockListing,
		additionalFees: [],
	};

	const defaultArgs = {
		chainId: 1,
		onSuccess: mockOnSuccess,
	};

	it('should generate listing transaction successfully', async () => {
		const { result } = renderHook(() =>
			useGenerateListingTransaction(defaultArgs),
		);

		await result.current.generateListingTransactionAsync(mockTransactionProps);

		expect(mockOnSuccess.mock.lastCall).toMatchInlineSnapshot(`
			[
			  [
			    {
			      "data": "0x...",
			      "id": "tokenApproval",
			      "price": 0n,
			      "to": "0x1234567890123456789012345678901234567890",
			      "value": 0n,
			    },
			    {
			      "data": "0x...",
			      "id": "createListing",
			      "price": 0n,
			      "to": "0x1234567890123456789012345678901234567890",
			      "value": 0n,
			    },
			  ],
			]
		`);
	});

	it('should handle non-async generation with callback', async () => {
		const { result } = renderHook(() =>
			useGenerateListingTransaction(defaultArgs),
		);

		result.current.generateListingTransaction(mockTransactionProps);

		await waitFor(() => {
			expect(mockOnSuccess).toHaveBeenCalled();
		});

		expect(mockOnSuccess.mock.lastCall).toMatchInlineSnapshot(`
			[
			  [
			    {
			      "data": "0x...",
			      "id": "tokenApproval",
			      "price": 0n,
			      "to": "0x1234567890123456789012345678901234567890",
			      "value": 0n,
			    },
			    {
			      "data": "0x...",
			      "id": "createListing",
			      "price": 0n,
			      "to": "0x1234567890123456789012345678901234567890",
			      "value": 0n,
			    },
			  ],
			]
		`);
	});

	it('should handle API errors', async () => {
		// Mock error response
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateListingTransaction'), () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);

		const { result } = renderHook(() =>
			useGenerateListingTransaction(defaultArgs),
		);

		await expect(
			result.current.generateListingTransactionAsync(mockTransactionProps),
		).rejects.toThrow();

		expect(mockOnSuccess).not.toHaveBeenCalled();
	});

	it('should handle invalid listing data', async () => {
		const invalidListing = {
			...mockListing,
			pricePerToken: -1n,
		};

		server.use(
			http.post(mockMarketplaceEndpoint('GenerateListingTransaction'), () => {
				return new HttpResponse(null, { status: 400 });
			}),
		);

		const { result } = renderHook(() =>
			useGenerateListingTransaction(defaultArgs),
		);

		await expect(
			result.current.generateListingTransactionAsync({
				...mockTransactionProps,
				listing: invalidListing,
			}),
		).rejects.toThrow();

		expect(mockOnSuccess).not.toHaveBeenCalled();
	});
});
