import { renderHook } from '@test';
import { TEST_COLLECTIBLE } from '@test/const';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCreateListingModal } from '..';
import { createListingModalStore } from '../internal/store';

const defaultArgs = {
	collectionAddress: TEST_COLLECTIBLE.collectionAddress,
	chainId: TEST_COLLECTIBLE.chainId,
	tokenId: TEST_COLLECTIBLE.tokenId,
};

describe('CreateListingModal', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.resetAllMocks();
		vi.restoreAllMocks();
		createListingModalStore.send({ type: 'close' });
	});

	describe('Store and Hook', () => {
		it('should open and close the modal via store', () => {
			createListingModalStore.send({ type: 'open', ...defaultArgs });
			expect(createListingModalStore.getSnapshot().context.isOpen).toBe(true);

			createListingModalStore.send({ type: 'close' });
			expect(createListingModalStore.getSnapshot().context.isOpen).toBe(false);
		});

		it('should provide show and close methods via useCreateListingModal hook', () => {
			const { result } = renderHook(() => useCreateListingModal());

			expect(result.current.show).toBeDefined();
			expect(result.current.close).toBeDefined();
		});
	});

	describe('Form State Management', () => {
		it('should update price input via store', () => {
			createListingModalStore.send({ type: 'open', ...defaultArgs });
			createListingModalStore.send({ type: 'updatePrice', value: '1.5' });

			expect(createListingModalStore.getSnapshot().context.priceInput).toBe(
				'1.5',
			);
		});

		it('should update quantity input via store', () => {
			createListingModalStore.send({ type: 'open', ...defaultArgs });
			createListingModalStore.send({ type: 'updateQuantity', value: '5' });

			expect(createListingModalStore.getSnapshot().context.quantityInput).toBe(
				'5',
			);
		});

		it('should update expiry days via store', () => {
			createListingModalStore.send({ type: 'open', ...defaultArgs });
			createListingModalStore.send({ type: 'updateExpiryDays', days: 14 });

			expect(createListingModalStore.getSnapshot().context.expiryDays).toBe(14);
		});
	});
});
