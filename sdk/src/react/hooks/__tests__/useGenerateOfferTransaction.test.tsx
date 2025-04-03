import { renderHook, server, waitFor } from '@test';
import { http, HttpResponse } from 'msw';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockMarketplaceEndpoint } from '../../_internal/api/__mocks__/marketplace.msw';
import {
	ContractType,
	OrderbookKind,
} from '../../_internal/api/marketplace.gen';
import { useGenerateOfferTransaction } from '../useGenerateOfferTransaction';

describe('useGenerateOfferTransaction', () => {
	const mockOnSuccess = vi.fn();

	const mockOffer = {
		tokenId: '1',
		quantity: '1',
		expiry: new Date('2024-12-31'),
		currencyAddress: zeroAddress,
		pricePerToken: '1000000000000000000',
	};

	const mockTransactionProps = {
		collectionAddress: zeroAddress,
		maker: zeroAddress,
		contractType: ContractType.ERC721,
		orderbook: OrderbookKind.sequence_marketplace_v2,
		offer: mockOffer,
	};

	const defaultArgs = {
		chainId: 1,
		onSuccess: mockOnSuccess,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should generate offer transaction successfully', async () => {
		const { result } = renderHook(() =>
			useGenerateOfferTransaction(defaultArgs),
		);

		await result.current.generateOfferTransactionAsync(mockTransactionProps);

		expect(mockOnSuccess.mock.lastCall).toMatchInlineSnapshot(`
			[
			  [
			    {
			      "data": "0x...",
			      "executeType": "order",
			      "id": "tokenApproval",
			      "price": "0",
			      "to": "0x1234567890123456789012345678901234567890",
			      "value": "0",
			    },
			  ],
			  {
			    "collectionAddress": "0x0000000000000000000000000000000000000000",
			    "contractType": "ERC721",
			    "maker": "0x0000000000000000000000000000000000000000",
			    "offer": {
			      "currencyAddress": "0x0000000000000000000000000000000000000000",
			      "expiry": 2024-12-31T00:00:00.000Z,
			      "pricePerToken": "1000000000000000000",
			      "quantity": "1",
			      "tokenId": "1",
			    },
			    "orderbook": "sequence_marketplace_v2",
			  },
			  undefined,
			]
		`);
	});

	it('should handle non-async generation with callback', async () => {
		const { result } = renderHook(() =>
			useGenerateOfferTransaction(defaultArgs),
		);

		result.current.generateOfferTransaction(mockTransactionProps);

		await waitFor(() => {
			expect(mockOnSuccess).toHaveBeenCalled();
		});
		expect(mockOnSuccess.mock.lastCall).toMatchInlineSnapshot(`
			[
			  [
			    {
			      "data": "0x...",
			      "executeType": "order",
			      "id": "tokenApproval",
			      "price": "0",
			      "to": "0x1234567890123456789012345678901234567890",
			      "value": "0",
			    },
			  ],
			  {
			    "collectionAddress": "0x0000000000000000000000000000000000000000",
			    "contractType": "ERC721",
			    "maker": "0x0000000000000000000000000000000000000000",
			    "offer": {
			      "currencyAddress": "0x0000000000000000000000000000000000000000",
			      "expiry": 2024-12-31T00:00:00.000Z,
			      "pricePerToken": "1000000000000000000",
			      "quantity": "1",
			      "tokenId": "1",
			    },
			    "orderbook": "sequence_marketplace_v2",
			  },
			  undefined,
			]
		`);
	});

	it('should handle API errors', async () => {
		// Mock error response
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateOfferTransaction'), () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);

		const { result } = renderHook(() =>
			useGenerateOfferTransaction(defaultArgs),
		);

		await expect(
			result.current.generateOfferTransactionAsync(mockTransactionProps),
		).rejects.toThrow();

		expect(mockOnSuccess).not.toHaveBeenCalled();
	});

	it('should handle invalid offer data', async () => {
		const invalidOffer = {
			...mockOffer,
			pricePerToken: 'invalid-price',
		};

		server.use(
			http.post(mockMarketplaceEndpoint('GenerateOfferTransaction'), () => {
				return new HttpResponse(null, { status: 400 });
			}),
		);

		const { result } = renderHook(() =>
			useGenerateOfferTransaction(defaultArgs),
		);

		await expect(
			result.current.generateOfferTransactionAsync({
				...mockTransactionProps,
				offer: invalidOffer,
			}),
		).rejects.toThrow();

		expect(mockOnSuccess).not.toHaveBeenCalled();
	});
});
