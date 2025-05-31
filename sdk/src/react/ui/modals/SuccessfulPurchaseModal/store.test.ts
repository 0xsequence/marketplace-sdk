import { describe, expect, it, vi } from 'vitest';
import type { TokenMetadata } from '../../../_internal';
import type { ModalCallbacks } from '../_internal/types';
import {
	successfulPurchaseModal,
	successfulPurchaseModalStore,
	useCallbacks,
	useIsOpen,
	useModalState,
} from './store';

describe('successfulPurchaseModalStore', () => {
	it('should have correct initial state', () => {
		const state = successfulPurchaseModalStore.getSnapshot();
		expect(state.context).toEqual({
			isOpen: false,
			state: {
				collectibles: [],
				totalPrice: '0',
				explorerName: '',
				explorerUrl: '',
				ctaOptions: undefined,
			},
			callbacks: undefined,
		});
	});

	it('should open modal with correct data', () => {
		const mockCollectibles: TokenMetadata[] = [
			{
				tokenId: '1',
				name: 'Test NFT',
				image: 'https://example.com/image.png',
				decimals: 0,
			} as TokenMetadata,
		];
		const mockCallbacks: ModalCallbacks = {
			onSuccess: vi.fn(),
			onError: vi.fn(),
		};
		const mockCtaOnClick = vi.fn();

		successfulPurchaseModalStore.send({
			type: 'open',
			collectibles: mockCollectibles,
			totalPrice: '100 ETH',
			explorerName: 'Etherscan',
			explorerUrl: 'https://etherscan.io',
			ctaOptions: {
				ctaLabel: 'View Collection',
				ctaOnClick: mockCtaOnClick,
			},
			callbacks: mockCallbacks,
		});

		const state = successfulPurchaseModalStore.getSnapshot();
		expect(state.context.isOpen).toBe(true);
		expect(state.context.state.collectibles).toEqual(mockCollectibles);
		expect(state.context.state.totalPrice).toBe('100 ETH');
		expect(state.context.state.explorerName).toBe('Etherscan');
		expect(state.context.state.explorerUrl).toBe('https://etherscan.io');
		expect(state.context.state.ctaOptions?.ctaLabel).toBe('View Collection');
		expect(state.context.state.ctaOptions?.ctaOnClick).toBe(mockCtaOnClick);
		expect(state.context.callbacks).toBe(mockCallbacks);
	});

	it('should use defaultCallbacks when callbacks are not provided', () => {
		const mockDefaultCallbacks: ModalCallbacks = {
			onSuccess: vi.fn(),
			onError: vi.fn(),
		};

		successfulPurchaseModalStore.send({
			type: 'open',
			collectibles: [],
			totalPrice: '0',
			explorerName: 'Explorer',
			explorerUrl: 'https://example.com',
			defaultCallbacks: mockDefaultCallbacks,
		});

		const state = successfulPurchaseModalStore.getSnapshot();
		expect(state.context.callbacks).toBe(mockDefaultCallbacks);
	});

	it('should close modal and reset state', () => {
		// First open the modal
		successfulPurchaseModalStore.send({
			type: 'open',
			collectibles: [{ tokenId: '1', name: 'Test' } as TokenMetadata],
			totalPrice: '50 ETH',
			explorerName: 'Explorer',
			explorerUrl: 'https://example.com',
			callbacks: { onSuccess: vi.fn() } as ModalCallbacks,
		});

		// Then close it
		successfulPurchaseModalStore.send({ type: 'close' });

		const state = successfulPurchaseModalStore.getSnapshot();
		expect(state.context).toEqual({
			isOpen: false,
			state: {
				collectibles: [],
				totalPrice: '0',
				explorerName: '',
				explorerUrl: '',
				ctaOptions: undefined,
			},
			callbacks: undefined,
		});
	});

	it('should support backward compatible API', () => {
		const mockCollectibles: TokenMetadata[] = [
			{ tokenId: '1', name: 'Test NFT' } as TokenMetadata,
		];
		const mockCallbacks: ModalCallbacks = {
			onSuccess: vi.fn(),
		};

		// Test open
		successfulPurchaseModal.open({
			collectibles: mockCollectibles,
			totalPrice: '10 ETH',
			explorerName: 'Etherscan',
			explorerUrl: 'https://etherscan.io',
			callbacks: mockCallbacks,
		});

		let state = successfulPurchaseModalStore.getSnapshot();
		expect(state.context.isOpen).toBe(true);
		expect(state.context.state.collectibles).toEqual(mockCollectibles);

		// Test state getter
		const stateData = successfulPurchaseModal.state.get();
		expect(stateData.collectibles).toEqual(mockCollectibles);
		expect(stateData.totalPrice).toBe('10 ETH');

		// Test close
		successfulPurchaseModal.close();
		state = successfulPurchaseModalStore.getSnapshot();
		expect(state.context.isOpen).toBe(false);
	});
});

// Note: Testing the selector hooks would require a React testing environment
// with renderHook from @testing-library/react-hooks
describe('successfulPurchaseModalStore selector hooks', () => {
	it.todo('should return correct state from useIsOpen');
	it.todo('should return correct state from useModalState');
	it.todo('should return correct state from useCallbacks');
});
