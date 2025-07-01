import { beforeEach, describe, expect, it } from 'vitest';
import type { OpenSellModalArgs } from './store';
import { sellModal$ } from './store';

describe('sellModal$ store', () => {
	const mockArgs: OpenSellModalArgs = {
		collectionAddress: '0x123',
		chainId: 1,
		tokenId: '1',
		order: {
			orderId: 'order-123',
			quantityRemaining: '1',
			priceAmount: '1000000000000000000',
			priceCurrencyAddress: '0x0000000000000000000000000000000000000000',
			marketplace: 'SEQUENCE_MARKETPLACE_V1',
			createdAt: '2024-01-01T00:00:00Z',
		} as any,
		callbacks: {
			onSuccess: () => {},
			onError: () => {},
		},
	};

	beforeEach(() => {
		// Reset store to initial state
		sellModal$.isOpen.set(false);
		sellModal$.collectionAddress.set('' as any);
		sellModal$.chainId.set(0);
		sellModal$.tokenId.set('');
		sellModal$.order.set(undefined);
		sellModal$.callbacks.set(undefined);
		sellModal$.sellIsBeingProcessed.set(false);
		sellModal$.steps.approval.exist.set(false);
		sellModal$.steps.approval.isExecuting.set(false);
		sellModal$.steps.transaction.exist.set(false);
		sellModal$.steps.transaction.isExecuting.set(false);
	});

	describe('open', () => {
		it('sets all properties correctly when opening modal', () => {
			sellModal$.open(mockArgs);

			expect(sellModal$.isOpen.get()).toBe(true);
			expect(sellModal$.collectionAddress.get()).toBe(
				mockArgs.collectionAddress,
			);
			expect(sellModal$.chainId.get()).toBe(mockArgs.chainId);
			expect(sellModal$.tokenId.get()).toBe(mockArgs.tokenId);
			expect(sellModal$.order.get()).toEqual(mockArgs.order);
			expect(sellModal$.callbacks.get()).toEqual(mockArgs.callbacks);
		});

		it('opens modal without callbacks', () => {
			const argsWithoutCallbacks = { ...mockArgs };
			delete argsWithoutCallbacks.callbacks;

			sellModal$.open(argsWithoutCallbacks);

			expect(sellModal$.isOpen.get()).toBe(true);
			expect(sellModal$.callbacks.get()).toBeUndefined();
		});

		it('overwrites existing state when opening with new args', () => {
			// First open
			sellModal$.open(mockArgs);

			// Second open with different args
			const newArgs: OpenSellModalArgs = {
				...mockArgs,
				collectionAddress: '0x456',
				chainId: 137,
				tokenId: '2',
			};

			sellModal$.open(newArgs);

			expect(sellModal$.collectionAddress.get()).toBe('0x456');
			expect(sellModal$.chainId.get()).toBe(137);
			expect(sellModal$.tokenId.get()).toBe('2');
		});
	});

	describe('close', () => {
		it('resets modal state when closing', () => {
			// Open modal first
			sellModal$.open(mockArgs);
			sellModal$.sellIsBeingProcessed.set(true);

			// Close modal
			sellModal$.close();

			expect(sellModal$.isOpen.get()).toBe(false);
			expect(sellModal$.callbacks.get()).toBeUndefined();
			expect(sellModal$.sellIsBeingProcessed.get()).toBe(false);
		});

		it('preserves other state when closing', () => {
			// Open modal and set some state
			sellModal$.open(mockArgs);
			sellModal$.steps.approval.exist.set(true);

			// Close modal
			sellModal$.close();

			// These should be reset
			expect(sellModal$.isOpen.get()).toBe(false);
			expect(sellModal$.callbacks.get()).toBeUndefined();
			expect(sellModal$.sellIsBeingProcessed.get()).toBe(false);

			// But other state remains (would be reset by component unmount)
			expect(sellModal$.collectionAddress.get()).toBe(
				mockArgs.collectionAddress,
			);
			expect(sellModal$.chainId.get()).toBe(mockArgs.chainId);
		});
	});

	describe('steps', () => {
		it('has correct initial state for steps', () => {
			expect(sellModal$.steps.approval.exist.get()).toBe(false);
			expect(sellModal$.steps.approval.isExecuting.get()).toBe(false);
			expect(sellModal$.steps.transaction.exist.get()).toBe(false);
			expect(sellModal$.steps.transaction.isExecuting.get()).toBe(false);
		});

		it('can update approval step state', () => {
			sellModal$.steps.approval.exist.set(true);
			sellModal$.steps.approval.isExecuting.set(true);

			expect(sellModal$.steps.approval.exist.get()).toBe(true);
			expect(sellModal$.steps.approval.isExecuting.get()).toBe(true);
		});

		it('can update transaction step state', () => {
			sellModal$.steps.transaction.exist.set(true);
			sellModal$.steps.transaction.isExecuting.set(true);

			expect(sellModal$.steps.transaction.exist.get()).toBe(true);
			expect(sellModal$.steps.transaction.isExecuting.get()).toBe(true);
		});

		it('has execute functions that return promises', async () => {
			const approvalResult = await sellModal$.steps.approval.execute();
			const transactionResult = await sellModal$.steps.transaction.execute();

			expect(approvalResult).toBeUndefined();
			expect(transactionResult).toBeUndefined();
		});
	});

	describe('sellIsBeingProcessed', () => {
		it('tracks sell processing state', () => {
			expect(sellModal$.sellIsBeingProcessed.get()).toBe(false);

			sellModal$.sellIsBeingProcessed.set(true);
			expect(sellModal$.sellIsBeingProcessed.get()).toBe(true);

			sellModal$.sellIsBeingProcessed.set(false);
			expect(sellModal$.sellIsBeingProcessed.get()).toBe(false);
		});
	});

	describe('reactive updates', () => {
		it('updates are reactive', () => {
			let updateCount = 0;
			const unsubscribe = sellModal$.isOpen.subscribe(() => {
				updateCount++;
			});

			sellModal$.open(mockArgs);
			expect(updateCount).toBe(2); // Initial subscription + open

			sellModal$.close();
			expect(updateCount).toBe(3); // + close

			unsubscribe();
		});
	});
});
