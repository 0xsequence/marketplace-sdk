import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CheckoutModal } from '../CheckoutModal';
import { parseUnits } from 'viem';
import type { Order, TokenMetadata } from '../../../../../_internal';
import {
	MarketplaceKind,
	OrderSide,
	OrderStatus,
} from '../../../../../_internal';

describe('CheckoutModal', () => {
	const mockBuy = vi.fn();

	const defaultOrder: Order = {
		orderId: '123',
		marketplace: MarketplaceKind.sequence_marketplace_v2,
		priceAmount: '1000000000000000000',
		priceCurrencyAddress: '0x0',
		quantityRemaining: '1',
		createdAt: new Date().toISOString(),
		side: OrderSide.listing,
		status: OrderStatus.active,
		chainId: 1,
		originName: 'test',
		collectionContractAddress: '0x1234567890123456789012345678901234567890',
		tokenId: '1',
		createdBy: '0x1234567890123456789012345678901234567890',
		priceAmountFormatted: '1.0',
		priceAmountNet: '950000000000000000',
		priceAmountNetFormatted: '0.95',
		priceDecimals: 18,
		priceUSD: 1800.0,
		quantityInitial: '1',
		quantityInitialFormatted: '1',
		quantityRemainingFormatted: '1',
		quantityAvailable: '1',
		quantityAvailableFormatted: '1',
		quantityDecimals: 0,
		feeBps: 500,
		feeBreakdown: [],
		validFrom: new Date().toISOString(),
		validUntil: new Date(Date.now() + 86400000).toISOString(),
		blockNumber: 1234567,
		updatedAt: new Date().toISOString(),
	};

	const defaultCollectable: TokenMetadata = {
		tokenId: '1',
		name: 'Test NFT',
		description: 'Test Description',
		image: 'https://test.com/image.png',
		attributes: [],
		decimals: 0,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should auto-execute buy function when mounted', async () => {
		render(
			<CheckoutModal
				buy={mockBuy}
				order={defaultOrder}
				collectable={defaultCollectable}
			/>,
		);

		await waitFor(() => {
			expect(mockBuy).toHaveBeenCalledTimes(1);
		});
	});

	it('should execute buy even when loading (current implementation)', async () => {
		render(
			<CheckoutModal
				buy={mockBuy}
				order={defaultOrder}
				collectable={defaultCollectable}
				isLoading={true}
			/>,
		);

		await waitFor(() => {
			expect(mockBuy).toHaveBeenCalledTimes(1);
			expect(mockBuy).toHaveBeenCalledWith({
				orderId: defaultOrder.orderId,
				collectableDecimals: defaultCollectable.decimals || 0,
				quantity: '1',
				marketplace: defaultOrder.marketplace,
			});
		});
	});

	it('should call buy with correct parameters', async () => {
		render(
			<CheckoutModal
				buy={mockBuy}
				order={defaultOrder}
				collectable={defaultCollectable}
			/>,
		);

		await waitFor(() => {
			expect(mockBuy).toHaveBeenCalledWith({
				orderId: defaultOrder.orderId,
				collectableDecimals: defaultCollectable.decimals || 0,
				quantity: '1',
				marketplace: defaultOrder.marketplace,
			});
		});
	});

	it('should handle decimals correctly', async () => {
		const collectableWithDecimals: TokenMetadata = {
			...defaultCollectable,
			decimals: 18,
		};

		render(
			<CheckoutModal
				buy={mockBuy}
				order={defaultOrder}
				collectable={collectableWithDecimals}
			/>,
		);

		await waitFor(() => {
			expect(mockBuy).toHaveBeenCalledWith({
				orderId: defaultOrder.orderId,
				collectableDecimals: collectableWithDecimals.decimals,
				quantity: parseUnits('1', 18).toString(),
				marketplace: defaultOrder.marketplace,
			});
		});

		// Test with different decimal values
		const collectableWithCustomDecimals: TokenMetadata = {
			...defaultCollectable,
			decimals: 6,
		};

		render(
			<CheckoutModal
				buy={mockBuy}
				order={defaultOrder}
				collectable={collectableWithCustomDecimals}
			/>,
		);

		await waitFor(() => {
			expect(mockBuy).toHaveBeenCalledWith({
				orderId: defaultOrder.orderId,
				collectableDecimals: collectableWithCustomDecimals.decimals,
				quantity: parseUnits('1', 6).toString(),
				marketplace: defaultOrder.marketplace,
			});
		});
	});
});
