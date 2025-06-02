import type { ContractInfo, TokenMetadata } from '@0xsequence/metadata';
import { renderHook, waitFor } from '@testing-library/react';
import { from } from 'dnum';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createWrapper } from '../../../../../test/test-utils';
import { ContractType } from '../../../../_internal';
import type { CheckoutOptions, Order } from '../../../../_internal';
import { usePriceCalculation } from '../hooks/usePriceCalculation';
import { buyModalStore } from '../store';

// Mock dependencies
vi.mock('../../../../_internal/api', () => ({
	useBuilder: () => ({
		data: { getTokenMetadata: () => mockTokenMetadata },
		isLoading: false,
		isError: false,
	}),
	useMarketplace: () => ({
		data: { getOrder: () => mockOrder },
		isLoading: false,
		isError: false,
	}),
}));

// Mock data
const mockCollection: ContractInfo = {
	chainId: 1,
	address: '0x1234567890123456789012345678901234567890',
	name: 'Test Collection',
	symbol: 'TEST',
	type: ContractType.ERC1155,
	decimals: 0,
	logoURI: '',
	extensions: {
		link: '',
		description: '',
		ogImage: '',
	},
};

const mockTokenMetadata: TokenMetadata = {
	tokenId: '1',
	name: 'Test NFT',
	description: 'A test NFT',
	image: 'https://example.com/image.png',
	decimals: 0,
	properties: {},
};

const mockOrder: Order = {
	orderId: 'order-123',
	marketplace: 'sequence',
	tokenContract: mockCollection.address,
	tokenId: '1',
	isListing: true,
	quantity: '100',
	quantityRemaining: '50',
	priceAmount: '50000000000000000', // 0.05 ETH in wei
	priceCurrencyAddress: '0x0000000000000000000000000000000000000000',
	maker: '0xabcdef1234567890123456789012345678901234',
	taker: null,
	expiry: '1735689600', // Future timestamp
	orderStatus: 'active',
	schemaHash: '0x123456789',
	createdAt: '2024-01-01T00:00:00Z',
	updatedAt: '2024-01-01T00:00:00Z',
};

const mockCheckoutOptions: CheckoutOptions = {
	walletAddress: '0x9876543210987654321098765432109876543210',
	fundingCurrencies: [
		{
			contractAddress: '0x0000000000000000000000000000000000000000',
			symbol: 'ETH',
			name: 'Ethereum',
			decimals: 18,
			imageUrl: '',
		},
	],
};

describe('BuyModal Flow Integration Tests', () => {
	beforeEach(() => {
		// Reset store state before each test
		buyModalStore.send({ type: 'reset' });
	});

	describe('ERC1155 Purchase Flow with dnum', () => {
		it('should handle complex price calculations without overflow', async () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '50000000000000000', // 0.05 ETH
						quantity: 100,
						decimals: 18,
						fees: [{ type: 'platform', percentage: 2.5 }],
					}),
				{ wrapper: createWrapper() },
			);

			await waitFor(() => {
				expect(result.current.isValid).toBe(true);
			});

			// Should calculate 100 * 0.05 ETH = 5 ETH subtotal
			expect(result.current.subtotal[0]).toBe(BigInt('5000000000000000000'));
			expect(result.current.subtotal[1]).toBe(18);

			// Should add 2.5% platform fee (5 ETH * 0.025 = 0.125 ETH)
			expect(result.current.fees[0]).toBe(BigInt('125000000000000000'));

			// Grand total should be 5.125 ETH
			expect(result.current.grandTotal[0]).toBe(BigInt('5125000000000000000'));
			expect(result.current.grandTotal[1]).toBe(18);

			// Display values should be formatted correctly
			expect(result.current.display.subtotal).toBe('5');
			expect(result.current.display.fees).toBe('0.125');
			expect(result.current.display.grandTotal).toBe('5.125');
		});

		it('should handle large quantity purchases without BigInt overflow', async () => {
			const largeQuantity = 999999;
			const unitPrice = '1000000000000000'; // 0.001 ETH

			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice,
						quantity: largeQuantity,
						decimals: 18,
						fees: [],
					}),
				{ wrapper: createWrapper() },
			);

			await waitFor(() => {
				expect(result.current.isValid).toBe(true);
			});

			// Should calculate without overflow: 999999 * 0.001 ETH = 999.999 ETH
			const expectedTotal = BigInt('999999000000000000000');
			expect(result.current.grandTotal[0]).toBe(expectedTotal);
			expect(result.current.grandTotal[1]).toBe(18);
		});

		it('should handle precision edge cases with small amounts', async () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '1', // 1 wei
						quantity: 3,
						decimals: 18,
						fees: [],
					}),
				{ wrapper: createWrapper() },
			);

			await waitFor(() => {
				expect(result.current.isValid).toBe(true);
			});

			// Should maintain precision for very small amounts
			expect(result.current.grandTotal[0]).toBe(3n);
			expect(result.current.grandTotal[1]).toBe(18);
		});
	});

	describe('Store State Management', () => {
		it('should prevent race conditions in modal state', async () => {
			// Initial state should be idle
			expect(buyModalStore.getSnapshot().context.paymentModalState).toBe(
				'idle',
			);

			// First modal open
			buyModalStore.send({ type: 'openPaymentModal' });
			expect(buyModalStore.getSnapshot().context.paymentModalState).toBe(
				'opening',
			);

			// Second attempt should not change state
			buyModalStore.send({ type: 'openPaymentModal' });
			expect(buyModalStore.getSnapshot().context.paymentModalState).toBe(
				'opening',
			);

			// Complete the opening process
			buyModalStore.send({ type: 'paymentModalOpened' });
			expect(buyModalStore.getSnapshot().context.paymentModalState).toBe(
				'open',
			);
		});

		it('should handle quantity updates for ERC1155', async () => {
			const initialQuantity = buyModalStore.getSnapshot().context.quantity;
			expect(initialQuantity).toBeNull();

			// Set quantity
			buyModalStore.send({ type: 'setQuantity', quantity: 10 });
			expect(buyModalStore.getSnapshot().context.quantity).toBe(10);

			// Update quantity
			buyModalStore.send({ type: 'setQuantity', quantity: 25 });
			expect(buyModalStore.getSnapshot().context.quantity).toBe(25);
		});
	});

	describe('Error Handling', () => {
		it('should handle invalid price inputs gracefully', async () => {
			expect(() => {
				renderHook(
					() =>
						usePriceCalculation({
							unitPrice: 'invalid-price',
							quantity: 1,
							decimals: 18,
							fees: [],
						}),
					{ wrapper: createWrapper() },
				);
			}).toThrow();
		});

		it('should handle zero quantity gracefully', async () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '1000000000000000000', // 1 ETH
						quantity: 0,
						decimals: 18,
						fees: [],
					}),
				{ wrapper: createWrapper() },
			);

			await waitFor(() => {
				expect(result.current.isValid).toBe(false);
			});

			expect(result.current.grandTotal[0]).toBe(0n);
		});

		it('should handle negative fees appropriately', async () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '1000000000000000000', // 1 ETH
						quantity: 1,
						decimals: 18,
						fees: [{ type: 'discount', percentage: -10 }], // 10% discount
					}),
				{ wrapper: createWrapper() },
			);

			await waitFor(() => {
				expect(result.current.isValid).toBe(true);
			});

			// 1 ETH - 10% = 0.9 ETH
			expect(result.current.grandTotal[0]).toBe(BigInt('900000000000000000'));
		});
	});

	describe('Multi-Decimal Currency Handling', () => {
		it('should handle USDC (6 decimals) correctly', async () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '1000000', // 1 USDC (6 decimals)
						quantity: 100,
						decimals: 6,
						fees: [],
					}),
				{ wrapper: createWrapper() },
			);

			await waitFor(() => {
				expect(result.current.isValid).toBe(true);
			});

			// 100 * 1 USDC = 100 USDC
			expect(result.current.grandTotal[0]).toBe(BigInt('100000000'));
			expect(result.current.grandTotal[1]).toBe(6);
		});

		it('should handle DAI (18 decimals) correctly', async () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '5000000000000000000', // 5 DAI
						quantity: 10,
						decimals: 18,
						fees: [{ type: 'gas', percentage: 1 }],
					}),
				{ wrapper: createWrapper() },
			);

			await waitFor(() => {
				expect(result.current.isValid).toBe(true);
			});

			// 10 * 5 DAI = 50 DAI + 1% fee = 50.5 DAI
			expect(result.current.grandTotal[0]).toBe(BigInt('50500000000000000000'));
			expect(result.current.grandTotal[1]).toBe(18);
		});
	});

	describe('Fee Calculations', () => {
		it('should handle multiple fee types correctly', async () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '1000000000000000000', // 1 ETH
						quantity: 1,
						decimals: 18,
						fees: [
							{ type: 'platform', percentage: 2.5 },
							{ type: 'royalty', percentage: 5.0 },
							{ type: 'gas', percentage: 0.5 },
						],
					}),
				{ wrapper: createWrapper() },
			);

			await waitFor(() => {
				expect(result.current.isValid).toBe(true);
			});

			// 1 ETH + 8% total fees = 1.08 ETH
			expect(result.current.grandTotal[0]).toBe(BigInt('1080000000000000000'));

			// Fees should be 0.08 ETH
			expect(result.current.fees[0]).toBe(BigInt('80000000000000000'));
		});

		it('should handle high percentage fees without overflow', async () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '999999999999999999', // Almost 1 ETH
						quantity: 1000,
						decimals: 18,
						fees: [{ type: 'high-fee', percentage: 50 }], // 50% fee
					}),
				{ wrapper: createWrapper() },
			);

			await waitFor(() => {
				expect(result.current.isValid).toBe(true);
			});

			// Should handle large calculations without overflow
			expect(result.current.grandTotal[0]).toBeGreaterThan(0n);
			expect(result.current.isValid).toBe(true);
		});
	});

	describe('Display Formatting', () => {
		it('should format display values with appropriate precision', async () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '123456789012345678', // 0.123456789012345678 ETH
						quantity: 1,
						decimals: 18,
						fees: [],
					}),
				{ wrapper: createWrapper() },
			);

			await waitFor(() => {
				expect(result.current.isValid).toBe(true);
			});

			// Should format with reasonable precision (6 decimal places max)
			expect(result.current.display.grandTotal).toBe('0.123457');
		});

		it('should handle very small amounts formatting', async () => {
			const { result } = renderHook(
				() =>
					usePriceCalculation({
						unitPrice: '1000', // 0.000000000000001 ETH
						quantity: 1,
						decimals: 18,
						fees: [],
					}),
				{ wrapper: createWrapper() },
			);

			await waitFor(() => {
				expect(result.current.isValid).toBe(true);
			});

			// Should show meaningful precision for very small amounts
			expect(result.current.display.grandTotal).toMatch(/0\.000001/);
		});
	});
});
