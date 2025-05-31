import type { SwitchChainError } from 'viem';
import { describe, expect, it, vi } from 'vitest';
import {
	switchChainModal,
	switchChainModalStore,
	useChainIdToSwitchTo,
	useIsOpen,
	useIsSwitching,
	useOnClose,
	useOnError,
	useOnSuccess,
} from './store';

describe('switchChainModalStore', () => {
	it('should have correct initial state', () => {
		const state = switchChainModalStore.getSnapshot();
		expect(state.context).toEqual({
			isOpen: false,
			chainIdToSwitchTo: undefined,
			isSwitching: false,
			onSuccess: undefined,
			onError: undefined,
			onClose: undefined,
		});
	});

	it('should open modal with correct data', () => {
		const onSuccess = vi.fn();
		const onError = vi.fn();
		const onClose = vi.fn();

		switchChainModalStore.send({
			type: 'open',
			chainIdToSwitchTo: 137,
			onSuccess,
			onError,
			onClose,
		});

		const state = switchChainModalStore.getSnapshot();
		expect(state.context.isOpen).toBe(true);
		expect(state.context.chainIdToSwitchTo).toBe(137);
		expect(state.context.onSuccess).toBe(onSuccess);
		expect(state.context.onError).toBe(onError);
		expect(state.context.onClose).toBe(onClose);
	});

	it('should close modal and reset state', () => {
		// First open the modal
		switchChainModalStore.send({
			type: 'open',
			chainIdToSwitchTo: 1,
			onSuccess: vi.fn(),
		});

		// Then close it
		switchChainModalStore.send({ type: 'close' });

		const state = switchChainModalStore.getSnapshot();
		expect(state.context).toEqual({
			isOpen: false,
			chainIdToSwitchTo: undefined,
			isSwitching: false,
			onSuccess: undefined,
			onError: undefined,
			onClose: undefined,
		});
	});

	it('should set isSwitching state', () => {
		switchChainModalStore.send({ type: 'setSwitching', isSwitching: true });
		expect(switchChainModalStore.getSnapshot().context.isSwitching).toBe(true);

		switchChainModalStore.send({ type: 'setSwitching', isSwitching: false });
		expect(switchChainModalStore.getSnapshot().context.isSwitching).toBe(false);
	});

	it('should support backward compatible API', () => {
		const onSuccess = vi.fn();
		const onError = vi.fn() as (error: SwitchChainError) => void;

		// Test open
		switchChainModal.open({
			chainIdToSwitchTo: 10,
			onSuccess,
			onError,
		});

		let state = switchChainModalStore.getSnapshot();
		expect(state.context.isOpen).toBe(true);
		expect(state.context.chainIdToSwitchTo).toBe(10);

		// Test close
		switchChainModal.close();
		state = switchChainModalStore.getSnapshot();
		expect(state.context.isOpen).toBe(false);

		// Test delete (alias for close)
		switchChainModal.open({ chainIdToSwitchTo: 10 });
		switchChainModal.delete();
		state = switchChainModalStore.getSnapshot();
		expect(state.context.isOpen).toBe(false);
	});
});

// Note: Testing the selector hooks would require a React testing environment
// with renderHook from @testing-library/react-hooks
describe('switchChainModalStore selector hooks', () => {
	it.todo('should return correct state from useIsOpen');
	it.todo('should return correct state from useChainIdToSwitchTo');
	it.todo('should return correct state from useIsSwitching');
	it.todo('should return correct state from useOnSuccess');
	it.todo('should return correct state from useOnError');
	it.todo('should return correct state from useOnClose');
});
