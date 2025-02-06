import { describe, it, expect, beforeEach } from 'vitest';
import { buyModal$, initialState } from '../store';
import type { Order } from '../../../../_internal';

describe('BuyModal Store', () => {
	beforeEach(() => {
		buyModal$.set(initialState);
	});

	it('should initialize with correct default state', () => {
		expect(buyModal$.isOpen.get()).toBe(false);
		expect(buyModal$.state.get()).toEqual({
			order: undefined as unknown as Order,
			quantity: '1',
			modalId: 0,
			invalidQuantity: false,
			checkoutModalIsLoading: false,
			checkoutModalLoaded: false,
		});
		expect(buyModal$.callbacks.get()).toBeUndefined();
	});

	it('should handle open action correctly', () => {
		const mockOrder: Order = {
			quantityAvailableFormatted: '10',
		} as Order;

		const mockCallbacks = {
			onSuccess: () => {},
			onError: () => {},
		};

		buyModal$.open({
			order: mockOrder,
			chainId: '1',
			collectionAddress: '0x123',
			tokenId: '123',
			callbacks: mockCallbacks,
		});

		expect(buyModal$.isOpen.get()).toBe(true);
		expect(buyModal$.state.get()).toEqual({
			order: mockOrder,
			quantity: '10',
			modalId: 1,
			invalidQuantity: false,
			checkoutModalIsLoading: false,
			checkoutModalLoaded: false,
		});
		expect(buyModal$.callbacks.get()).toBe(mockCallbacks);
	});

	it('should handle close action correctly', () => {
		const mockOrder: Order = {
			quantityAvailableFormatted: '10',
		} as Order;

		buyModal$.open({
			order: mockOrder,
			chainId: '1',
			collectionAddress: '0x123',
			tokenId: '123',
			callbacks: {
				onSuccess: () => {},
				onError: () => {},
			},
		});

		expect(buyModal$.isOpen.get()).toBe(true);

		buyModal$.close();

		expect(buyModal$.isOpen.get()).toBe(false);
		expect(buyModal$.state.get()).toEqual(initialState.state);
		expect(buyModal$.state.get().quantity).toBe('1');
		expect(buyModal$.state.get().modalId).toBe(0);
		expect(buyModal$.state.get().invalidQuantity).toBe(false);
		expect(buyModal$.state.get().checkoutModalIsLoading).toBe(false);
		expect(buyModal$.state.get().checkoutModalLoaded).toBe(false);
		expect(buyModal$.callbacks.get()).toBeUndefined();
	});

	it('should update loading states correctly', () => {
		buyModal$.state.checkoutModalIsLoading.set(true);
		expect(buyModal$.state.checkoutModalIsLoading.get()).toBe(true);

		buyModal$.state.checkoutModalLoaded.set(true);
		expect(buyModal$.state.checkoutModalLoaded.get()).toBe(true);

		buyModal$.state.checkoutModalIsLoading.set(false);
		buyModal$.state.checkoutModalLoaded.set(false);
		expect(buyModal$.state.checkoutModalIsLoading.get()).toBe(false);
		expect(buyModal$.state.checkoutModalLoaded.get()).toBe(false);
	});
});
