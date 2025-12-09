import { describe, expect, it } from 'vitest';
import { CurrencyStatus } from '../../../../../../_internal';
import { TransactionType } from '../../../../../../_internal/types';
import type { TransactionStatus } from '../store';
import { getFormattedType } from '../util/getFormattedType';
import { getTransactionStatusModalMessage } from '../util/getMessage';
import {
	getTransactionStatusModalSpinnerTitle,
	getTransactionStatusModalTitle,
} from '../util/getTitle';

describe('Transaction Status Modal Utils', () => {
	describe('getFormattedType', () => {
		it('should return correct format for each transaction type', () => {
			expect(getFormattedType(TransactionType.TRANSFER)).toBe('transfer');
			expect(getFormattedType(TransactionType.LISTING)).toBe('listing');
			expect(getFormattedType(TransactionType.BUY)).toBe('purchase');
			expect(getFormattedType(TransactionType.SELL)).toBe('sale');
			expect(getFormattedType(TransactionType.CANCEL)).toBe('cancellation');
			expect(getFormattedType(TransactionType.OFFER)).toBe('offer');
		});

		it('should return correct verb format when verb flag is true', () => {
			expect(getFormattedType(TransactionType.TRANSFER, true)).toBe(
				'transferred',
			);
			expect(getFormattedType(TransactionType.LISTING, true)).toBe('listed');
			expect(getFormattedType(TransactionType.BUY, true)).toBe('purchased');
			expect(getFormattedType(TransactionType.SELL, true)).toBe('sold');
			expect(getFormattedType(TransactionType.CANCEL, true)).toBe('cancelled');
			expect(getFormattedType(TransactionType.OFFER, true)).toBe('offered');
		});

		it("should return 'transaction' for unknown transaction types", () => {
			expect(getFormattedType('UNKNOWN' as TransactionType)).toBe(
				'transaction',
			);
		});
	});

	describe('getTransactionStatusModalMessage', () => {
		const baseArgs = {
			transactionType: TransactionType.BUY,
			collectibleName: 'Test NFT',
		};

		it('should return correct message for each transaction status', () => {
			expect(
				getTransactionStatusModalMessage({
					...baseArgs,
					transactionStatus: 'PENDING',
				}),
			).toBe(
				'You just purchased Test NFT. It should be confirmed on the blockchain shortly.',
			);

			expect(
				getTransactionStatusModalMessage({
					...baseArgs,
					transactionStatus: 'SUCCESS',
				}),
			).toBe(
				"You just purchased Test NFT. It's been confirmed on the blockchain!",
			);

			expect(
				getTransactionStatusModalMessage({
					...baseArgs,
					transactionStatus: 'FAILED',
				}),
			).toBe('Your purchase has failed.');

			expect(
				getTransactionStatusModalMessage({
					...baseArgs,
					transactionStatus: 'TIMEOUT',
				}),
			).toBe(
				'Your purchase takes too long. Click the link below to track it on the explorer.',
			);
		});

		it('should handle order ID case', () => {
			expect(
				getTransactionStatusModalMessage({
					...baseArgs,
					orderId: '123',
					transactionStatus: 'SUCCESS',
				}),
			).toBe(
				"You just purchased Test NFT. It's been confirmed on the blockchain!",
			);
		});

		it('should handle offer with price', () => {
			expect(
				getTransactionStatusModalMessage({
					transactionType: TransactionType.OFFER,
					collectibleName: 'Test NFT',
					transactionStatus: 'SUCCESS',
					price: {
						amountRaw: 1000000000000000000n,
						currency: {
							chainId: 1,
							contractAddress: '0x0000000000000000000000000000000000000000',
							name: 'Ethereum',
							symbol: 'ETH',
							decimals: 18,
							imageUrl: 'https://ethereum.org/eth.png',
							exchangeRate: 1,
							defaultChainCurrency: true,
							nativeCurrency: true,
							openseaListing: true,
							openseaOffer: true,
							createdAt: '2024-01-21T00:00:00Z',
							updatedAt: '2024-01-21T00:00:00Z',
							status: CurrencyStatus.active,
						},
					},
				}),
			).toBe(
				"You just offered 1 ETH for Test NFT. It's been confirmed on the blockchain!",
			);
		});

		it('should hide collectible name for cancel transactions', () => {
			expect(
				getTransactionStatusModalMessage({
					transactionType: TransactionType.CANCEL,
					collectibleName: 'Test NFT',
					transactionStatus: 'SUCCESS',
				}),
			).toBe("You just cancelled. It's been confirmed on the blockchain!");
		});
	});

	describe('getTransactionStatusModalTitle', () => {
		const baseArgs = {
			transactionType: TransactionType.BUY,
		};

		it('should return correct title for each transaction status', () => {
			expect(
				getTransactionStatusModalTitle({
					...baseArgs,
					transactionStatus: 'PENDING',
				}),
			).toBe('Your purchase is processing');

			expect(
				getTransactionStatusModalTitle({
					...baseArgs,
					transactionStatus: 'SUCCESS',
				}),
			).toBe('Your purchase has processed');

			expect(
				getTransactionStatusModalTitle({
					...baseArgs,
					transactionStatus: 'FAILED',
				}),
			).toBe('Your purchase has failed');

			expect(
				getTransactionStatusModalTitle({
					...baseArgs,
					transactionStatus: 'TIMEOUT',
				}),
			).toBe('Your purchase takes too long');
		});

		it('should handle order ID case', () => {
			expect(
				getTransactionStatusModalTitle({
					...baseArgs,
					orderId: '123',
					transactionStatus: 'SUCCESS',
				}),
			).toBe('Your purchase has processed');
		});

		it('should return empty string when transaction type is undefined', () => {
			expect(
				getTransactionStatusModalTitle({
					transactionType: undefined,
					transactionStatus: 'SUCCESS',
				}),
			).toBe('');
		});
	});

	describe('getTransactionStatusModalSpinnerTitle', () => {
		it('should return correct spinner title for each status', () => {
			const statuses: TransactionStatus[] = [
				'PENDING',
				'SUCCESS',
				'FAILED',
				'TIMEOUT',
			];
			const expectedTitles = {
				PENDING: 'Processing transaction',
				SUCCESS: 'Transaction completed',
				FAILED: 'Transaction failed',
				TIMEOUT: 'Taking too long',
			};

			for (const status of statuses) {
				expect(
					getTransactionStatusModalSpinnerTitle({ transactionStatus: status }),
				).toBe(expectedTitles[status]);
			}
		});

		it('should return default title for unknown status', () => {
			expect(
				getTransactionStatusModalSpinnerTitle({
					transactionStatus: 'UNKNOWN' as TransactionStatus,
				}),
			).toBe('Processing transaction');
		});
	});
});
