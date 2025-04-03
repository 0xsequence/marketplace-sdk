import { renderHook, server, waitFor } from '@test';
import { http, HttpResponse } from 'msw';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	mockMarketplaceEndpoint,
	mockSteps,
} from '../../_internal/api/__mocks__/marketplace.msw';
import {
	ContractType,
	MarketplaceKind,
	OrderbookKind,
} from '../../_internal/api/marketplace.gen';
import { useGenerateSellTransaction } from '../useGenerateSellTransaction';

describe('useGenerateSellTransaction', () => {
	const mockOnSuccess = vi.fn();

	const mockOrderData = {
		orderId: '1',
		quantity: '1',
	};

	const mockTransactionProps = {
		collectionAddress: zeroAddress,
		seller: zeroAddress,
		contractType: ContractType.ERC721,
		orderbook: OrderbookKind.sequence_marketplace_v2,
		marketplace: MarketplaceKind.sequence_marketplace_v2,
		ordersData: [mockOrderData],
		additionalFees: [],
	};

	const defaultArgs = {
		chainId: 1,
		onSuccess: mockOnSuccess,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should generate sell transaction successfully', async () => {
		const { result } = renderHook(() =>
			useGenerateSellTransaction(defaultArgs),
		);

		await result.current.generateSellTransactionAsync(mockTransactionProps);

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
			    "additionalFees": [],
			    "collectionAddress": "0x0000000000000000000000000000000000000000",
			    "contractType": "ERC721",
			    "marketplace": "sequence_marketplace_v2",
			    "orderbook": "sequence_marketplace_v2",
			    "ordersData": [
			      {
			        "orderId": "1",
			        "quantity": "1",
			      },
			    ],
			    "seller": "0x0000000000000000000000000000000000000000",
			  },
			  undefined,
			]
		`);
	});

	it('should handle non-async generation with callback', async () => {
		const { result } = renderHook(() =>
			useGenerateSellTransaction(defaultArgs),
		);

		result.current.generateSellTransaction(mockTransactionProps);

		await waitFor(() => {
			expect(mockOnSuccess).toHaveBeenCalledWith(
				mockSteps,
				mockTransactionProps,
				undefined,
			);
		});
	});

	it('should handle API errors', async () => {
		// Mock error response
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateSellTransaction'), () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);

		const { result } = renderHook(() =>
			useGenerateSellTransaction(defaultArgs),
		);

		await expect(
			result.current.generateSellTransactionAsync(mockTransactionProps),
		).rejects.toThrow();

		expect(mockOnSuccess).not.toHaveBeenCalled();
	});

	it('should handle invalid sell data', async () => {
		const invalidOrderData = {
			orderId: '1',
			quantity: 'invalid-quantity',
		};

		server.use(
			http.post(mockMarketplaceEndpoint('GenerateSellTransaction'), () => {
				return new HttpResponse(null, { status: 400 });
			}),
		);

		const { result } = renderHook(() =>
			useGenerateSellTransaction(defaultArgs),
		);

		await expect(
			result.current.generateSellTransactionAsync({
				...mockTransactionProps,
				ordersData: [invalidOrderData],
			}),
		).rejects.toThrow();

		expect(mockOnSuccess).not.toHaveBeenCalled();
	});
});
