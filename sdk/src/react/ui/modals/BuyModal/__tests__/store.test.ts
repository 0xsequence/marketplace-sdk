import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MarketplaceKind } from '../../../../_internal';
import type { DatabeatAnalytics } from '../../../../_internal/databeat';
import { buyModalStore, type MarketplaceBuyModalProps } from '../store';

const analyticsFn = {
	trackBuyModalOpened: vi.fn(),
} as unknown as DatabeatAnalytics;

describe('BuyModal Store', () => {
	beforeEach(() => {
		buyModalStore.send({ type: 'close' });
	});

	it('should initialize with correct default state', () => {
		const state = buyModalStore.getSnapshot();
		expect(state.context.isOpen).toBe(false);
		expect(state.context.props).toBeDefined();
		expect(state.context.quantity).toBeNull();
	});

	it('should handle open action correctly', () => {
		const mockProps: MarketplaceBuyModalProps = {
			orderId: '1',
			chainId: 1,
			collectionAddress: '0x123',
			tokenId: 1n,
			marketplace: MarketplaceKind.sequence_marketplace_v2,
			cardType: 'market',
		};

		buyModalStore.send({
			type: 'open',
			props: mockProps,
			onSuccess: () => {},
			onError: () => {},
			analyticsFn,
		});

		const state = buyModalStore.getSnapshot();
		expect(state.context.isOpen).toBe(true);
		expect(state.context.props).toEqual(mockProps);
	});

	it('should handle close action correctly', () => {
		const mockProps: MarketplaceBuyModalProps = {
			orderId: '1',
			chainId: 1,
			collectionAddress: '0x123',
			tokenId: 1n,
			marketplace: MarketplaceKind.sequence_marketplace_v2,
			cardType: 'market',
		};

		buyModalStore.send({
			type: 'open',
			props: mockProps,
			onSuccess: () => {},
			onError: () => {},
			analyticsFn,
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
			collectionAddress: '0x123',
			tokenId: 1n,
			marketplace: MarketplaceKind.sequence_marketplace_v2,
			cardType: 'market',
		};

		buyModalStore.send({
			type: 'open',
			props: mockProps,
			analyticsFn,
		});

		const state1 = buyModalStore.getSnapshot();
		expect(state1.context.quantity).toBeNull();

		buyModalStore.send({
			type: 'setQuantity',
			quantity: 5,
		});

		const state2 = buyModalStore.getSnapshot();
		expect(state2.context.quantity).toBe(5);

		// Test resetting by closing
		buyModalStore.send({ type: 'close' });

		const state3 = buyModalStore.getSnapshot();
		expect(state3.context.quantity).toBeNull();
	});
});
