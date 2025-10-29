import { ContractType } from '@0xsequence/indexer';
import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MarketplaceKind, OrderbookKind, StepType } from '../../_internal';
import {
	createMockSteps,
	mockMarketplaceEndpoint,
} from '../../_internal/api/__mocks__/marketplace.msw';
import { useGenerateSellTransaction } from './useGenerateSellTransaction';

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
			      "id": "tokenApproval",
			      "price": "0",
			      "to": "0x1234567890123456789012345678901234567890",
			      "value": "0",
			    },
			    {
			      "data": "0x...",
			      "id": "sell",
			      "price": "0",
			      "to": "0x1234567890123456789012345678901234567890",
			      "value": "0",
			    },
			  ],
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
				createMockSteps([StepType.tokenApproval, StepType.sell]),
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
