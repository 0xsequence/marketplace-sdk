import { renderHook } from '@test';
import { TEST_COLLECTIBLE } from '@test/const';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMakeOfferModal } from '..';
import { makeOfferModalStore } from '../internal/store';

const defaultArgs = {
	collectionAddress: TEST_COLLECTIBLE.collectionAddress,
	chainId: TEST_COLLECTIBLE.chainId,
	tokenId: TEST_COLLECTIBLE.tokenId,
};

describe('MakeOfferModal', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.resetAllMocks();
		vi.restoreAllMocks();
		makeOfferModalStore.send({ type: 'close' });
	});

	describe('Store and Hook', () => {
		it('should open and close the modal via store', () => {
			makeOfferModalStore.send({ type: 'open', ...defaultArgs });
			expect(makeOfferModalStore.getSnapshot().context.isOpen).toBe(true);

			makeOfferModalStore.send({ type: 'close' });
			expect(makeOfferModalStore.getSnapshot().context.isOpen).toBe(false);
		});

		it('should provide show and close methods via useMakeOfferModal hook', () => {
			const { result } = renderHook(() => useMakeOfferModal());

			expect(result.current.show).toBeDefined();
			expect(result.current.close).toBeDefined();
		});
	});

	describe('Form State Management', () => {
		it('should update price input via store', () => {
			makeOfferModalStore.send({ type: 'open', ...defaultArgs });
			makeOfferModalStore.send({ type: 'updatePrice', value: '1.5' });

			expect(makeOfferModalStore.getSnapshot().context.priceInput).toBe('1.5');
		});

		it('should update quantity input via store', () => {
			makeOfferModalStore.send({ type: 'open', ...defaultArgs });
			makeOfferModalStore.send({ type: 'updateQuantity', value: '5' });

			expect(makeOfferModalStore.getSnapshot().context.quantityInput).toBe('5');
		});

		it('should update expiry days via store', () => {
			makeOfferModalStore.send({ type: 'open', ...defaultArgs });
			makeOfferModalStore.send({ type: 'updateExpiryDays', days: 14 });

			expect(makeOfferModalStore.getSnapshot().context.expiryDays).toBe(14);
		});
	});
});
