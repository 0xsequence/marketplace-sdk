import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import {
	actionModalStore,
	closeModal,
	openModal,
	useActionModalChainId,
	useActionModalCollectionAddress,
	useActionModalState,
	useIsActionModalOpen,
} from './store';

describe('actionModalStore', () => {
	it('should have correct initial state', () => {
		const state = actionModalStore.getSnapshot();
		expect(state.context).toEqual({
			isOpen: false,
			chainId: null,
			collectionAddress: null,
		});
	});

	it('should open modal with correct data', () => {
		openModal(1, zeroAddress);

		const state = actionModalStore.getSnapshot();
		expect(state.context).toEqual({
			isOpen: true,
			chainId: 1,
			collectionAddress: zeroAddress,
		});
	});

	it('should close modal and reset state', () => {
		// First open the modal
		openModal(137, zeroAddress);

		// Then close it
		closeModal();

		const state = actionModalStore.getSnapshot();
		expect(state.context).toEqual({
			isOpen: false,
			chainId: null,
			collectionAddress: null,
		});
	});

	it('should handle multiple open/close cycles', () => {
		// First cycle
		openModal(1, zeroAddress);
		expect(actionModalStore.getSnapshot().context.isOpen).toBe(true);
		expect(actionModalStore.getSnapshot().context.chainId).toBe(1);

		closeModal();
		expect(actionModalStore.getSnapshot().context.isOpen).toBe(false);

		// Second cycle with different data
		const newAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f89590' as const;
		openModal(137, newAddress);
		expect(actionModalStore.getSnapshot().context.isOpen).toBe(true);
		expect(actionModalStore.getSnapshot().context.chainId).toBe(137);
		expect(actionModalStore.getSnapshot().context.collectionAddress).toBe(
			newAddress,
		);
	});

	it('should update state when using store.send directly', () => {
		actionModalStore.send({
			type: 'open',
			chainId: 42,
			collectionAddress: zeroAddress,
		});

		const state = actionModalStore.getSnapshot();
		expect(state.context.isOpen).toBe(true);
		expect(state.context.chainId).toBe(42);
		expect(state.context.collectionAddress).toBe(zeroAddress);
	});
});

// Note: Testing the selector hooks would require a React testing environment
// with renderHook from @testing-library/react-hooks
describe('actionModalStore selector hooks', () => {
	it.todo('should return correct state from useActionModalState');
	it.todo('should return correct isOpen from useIsActionModalOpen');
	it.todo('should return correct chainId from useActionModalChainId');
	it.todo(
		'should return correct collectionAddress from useActionModalCollectionAddress',
	);
});
