import { beforeEach, describe, expect, it } from 'vitest';
import { MarketplaceKind } from '../../../../_internal';
import { type MarketplaceBuyModalProps, buyModalStore } from '../store';

describe('BuyModal Store', () => {
	beforeEach(() => {
		buyModalStore.send({ type: 'close' });
	});

	it('should initialize with correct default state', () => {
		const state = buyModalStore.getSnapshot();
		expect(state.context.isOpen).toBe(false);
		expect(state.context.props).toBeDefined();
		expect(state.context.quantity).toBeUndefined();
	});

	it('should handle open action correctly', () => {
		const mockProps: MarketplaceBuyModalProps = {
			orderId: '1',
			chainId: 1,
			collectionAddress: '0x123' as `0x${string}`,
			collectibleId: '1',
			marketplace: MarketplaceKind.sequence_marketplace_v2,
			marketplaceType: 'market',
			quantityDecimals: 0,
			quantityRemaining: 10,
		};

		buyModalStore.send({
			type: 'open',
			props: mockProps,
			onSuccess: () => {},
			onError: () => {},
		});

		const state = buyModalStore.getSnapshot();
		expect(state.context.isOpen).toBe(true);
		expect(state.context.props).toEqual(mockProps);
	});

	it('should handle close action correctly', () => {
		const mockProps: MarketplaceBuyModalProps = {
			orderId: '1',
			chainId: 1,
			collectionAddress: '0x123' as `0x${string}`,
			collectibleId: '1',
			marketplace: MarketplaceKind.sequence_marketplace_v2,
			marketplaceType: 'market',
			quantityDecimals: 0,
			quantityRemaining: 10,
		};

		buyModalStore.send({
			type: 'open',
			props: mockProps,
			onSuccess: () => {},
			onError: () => {},
		});

		const openState = buyModalStore.getSnapshot();
		expect(openState.context.isOpen).toBe(true);

		buyModalStore.send({ type: 'close' });

		const closedState = buyModalStore.getSnapshot();
		expect(closedState.context.isOpen).toBe(false);
	});

	it('should update loading states correctly', () => {
		const mockProps: MarketplaceBuyModalProps = {
			orderId: '1',
			chainId: 1,
			collectionAddress: '0x123' as `0x${string}`,
			collectibleId: '1',
			marketplace: MarketplaceKind.sequence_marketplace_v2,
			marketplaceType: 'market',
			quantityDecimals: 0,
			quantityRemaining: 10,
		};

		buyModalStore.send({
			type: 'open',
			props: mockProps,
			onSuccess: () => {},
			onError: () => {},
		});

		const state1 = buyModalStore.getSnapshot();
		expect(state1.context.quantity).toBeUndefined();

		buyModalStore.send({
			type: 'setQuantity',
			quantity: 5,
		});

		const state2 = buyModalStore.getSnapshot();
		expect(state2.context.quantity).toBe(5);

		// Test resetting by closing
		buyModalStore.send({ type: 'close' });

		const state3 = buyModalStore.getSnapshot();
		expect(state3.context.quantity).toBeUndefined();
	});
});
