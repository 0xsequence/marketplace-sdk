import type { Address } from 'viem';
import { describe, expect, it, vi } from 'vitest';
import type { ModalCallbacks } from '../_internal/types';
import { transferModal, transferModalStore } from './store';

describe('transferModalStore', () => {
	it('should have correct initial state', () => {
		const state = transferModalStore.getSnapshot();
		expect(state.context).toEqual({
			isOpen: false,
			state: {
				receiverAddress: '',
				collectionAddress: '0x',
				chainId: 0,
				collectibleId: '',
				quantity: '1',
				transferIsBeingProcessed: false,
			},
			view: 'enterReceiverAddress',
			hash: undefined,
		});
	});

	it('should open modal with correct data', () => {
		const mockCallbacks: ModalCallbacks = {
			onSuccess: vi.fn(),
			onError: vi.fn(),
		};

		transferModalStore.send({
			type: 'open',
			chainId: 137,
			collectionAddress: '0x123' as Address,
			collectibleId: '1',
			callbacks: mockCallbacks,
		});

		const state = transferModalStore.getSnapshot();
		expect(state.context.isOpen).toBe(true);
		expect(state.context.state.chainId).toBe(137);
		expect(state.context.state.collectionAddress).toBe('0x123');
		expect(state.context.state.collectibleId).toBe('1');
		expect(state.context.state.callbacks).toBe(mockCallbacks);
	});

	it('should close modal and reset state', () => {
		// First open the modal
		transferModalStore.send({
			type: 'open',
			chainId: 1,
			collectionAddress: '0xabc' as Address,
			collectibleId: '5',
		});

		// Modify some state
		transferModalStore.send({ type: 'setReceiverAddress', address: '0xdef' });
		transferModalStore.send({
			type: 'setView',
			view: 'followWalletInstructions',
		});

		// Then close it
		transferModalStore.send({ type: 'close' });

		const state = transferModalStore.getSnapshot();
		expect(state.context).toEqual({
			isOpen: false,
			state: {
				receiverAddress: '',
				collectionAddress: '0x',
				chainId: 0,
				collectibleId: '',
				quantity: '1',
				transferIsBeingProcessed: false,
			},
			view: 'enterReceiverAddress',
			hash: undefined,
		});
	});

	it('should update view', () => {
		transferModalStore.send({
			type: 'setView',
			view: 'followWalletInstructions',
		});
		expect(transferModalStore.getSnapshot().context.view).toBe(
			'followWalletInstructions',
		);

		transferModalStore.send({ type: 'setView', view: 'enterReceiverAddress' });
		expect(transferModalStore.getSnapshot().context.view).toBe(
			'enterReceiverAddress',
		);
	});

	it('should update receiver address', () => {
		transferModalStore.send({
			type: 'setReceiverAddress',
			address: '0x1234567890123456789012345678901234567890',
		});
		expect(transferModalStore.getSnapshot().context.state.receiverAddress).toBe(
			'0x1234567890123456789012345678901234567890',
		);
	});

	it('should update quantity', () => {
		transferModalStore.send({ type: 'setQuantity', quantity: '10' });
		expect(transferModalStore.getSnapshot().context.state.quantity).toBe('10');
	});

	it('should update transfer processing state', () => {
		transferModalStore.send({
			type: 'setTransferIsBeingProcessed',
			isProcessing: true,
		});
		expect(
			transferModalStore.getSnapshot().context.state.transferIsBeingProcessed,
		).toBe(true);

		transferModalStore.send({
			type: 'setTransferIsBeingProcessed',
			isProcessing: false,
		});
		expect(
			transferModalStore.getSnapshot().context.state.transferIsBeingProcessed,
		).toBe(false);
	});

	it('should set hash', () => {
		const hash = '0xabcdef1234567890' as `0x${string}`;
		transferModalStore.send({ type: 'setHash', hash });
		expect(transferModalStore.getSnapshot().context.hash).toBe(hash);
	});

	it('should support backward compatible API', () => {
		const mockCallbacks: ModalCallbacks = { onSuccess: vi.fn() };

		// Test open
		transferModal.open({
			chainId: 10,
			collectionAddress: '0xaaa' as Address,
			collectibleId: '99',
			callbacks: mockCallbacks,
		});

		let state = transferModalStore.getSnapshot();
		expect(state.context.isOpen).toBe(true);
		expect(state.context.state.chainId).toBe(10);

		// Test state getter
		const stateData = transferModal.state.get();
		expect(stateData.chainId).toBe(10);
		expect(stateData.collectionAddress).toBe('0xaaa');

		// Test property setters
		transferModal.state.receiverAddress.set('0xbbb');
		state = transferModalStore.getSnapshot();
		expect(state.context.state.receiverAddress).toBe('0xbbb');

		transferModal.state.transferIsBeingProcessed.set(true);
		state = transferModalStore.getSnapshot();
		expect(state.context.state.transferIsBeingProcessed).toBe(true);

		// Test view setter
		transferModal.view.set('followWalletInstructions');
		state = transferModalStore.getSnapshot();
		expect(state.context.view).toBe('followWalletInstructions');

		// Test hash setter
		transferModal.hash.set('0x999' as `0x${string}`);
		state = transferModalStore.getSnapshot();
		expect(state.context.hash).toBe('0x999');

		// Test get method
		const fullState = transferModal.get();
		expect(fullState.isOpen).toBe(true);
		expect(fullState.state.chainId).toBe(10);

		// Test isOpen getter
		expect(transferModal.isOpen.get()).toBe(true);

		// Test close
		transferModal.close();
		state = transferModalStore.getSnapshot();
		expect(state.context.isOpen).toBe(false);
	});

	it('should support updateState method', () => {
		transferModalStore.send({
			type: 'updateState',
			chainId: 42,
			collectionAddress: '0xfff' as `0x${string}`,
			receiverAddress: '0xeee',
		});

		const state = transferModalStore.getSnapshot();
		expect(state.context.state.chainId).toBe(42);
		expect(state.context.state.collectionAddress).toBe('0xfff');
		expect(state.context.state.receiverAddress).toBe('0xeee');
	});
});

// Note: Testing the selector hooks would require a React testing environment
// with renderHook from @testing-library/react-hooks
describe('transferModalStore selector hooks', () => {
	it.todo('should return correct state from useIsOpen');
	it.todo('should return correct state from useModalState');
	it.todo('should return correct state from useView');
	it.todo('should return correct state from useHash');
});
