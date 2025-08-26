import { renderHook, wagmiConfig, waitFor } from '@test';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { switchChainErrorModalStore } from '../../../ui/modals/_internal/components/switchChainErrorModal/store';
import { useEnsureCorrectChain } from '../useEnsureCorrectChain';

const currentChain = wagmiConfig.chains[0]; // mainnet
const chainToSwitchTo = wagmiConfig.chains[1]; // polygon

describe('useEnsureCorrectChain', () => {
	beforeEach(() => {
		switchChainErrorModalStore.send({ type: 'close' });
	});

	test('returns current chain id', async () => {
		const { result } = renderHook(() => useEnsureCorrectChain());
		// Wait for the account to be connected and chainId to be available
		await waitFor(() => {
			expect(result.current.currentChainId).toBeDefined();
		});
		expect(result.current.currentChainId).toBe(currentChain.id);
	});

	test('does nothing if already on correct chain', () => {
		const { result } = renderHook(() => useEnsureCorrectChain());
		const onSuccess = vi.fn();

		result.current.ensureCorrectChain(currentChain.id, { onSuccess });

		expect(onSuccess).toHaveBeenCalled();
	});

	test('attempts to switch chain and shows error modal when switch fails', async () => {
		const { result } = renderHook(() => useEnsureCorrectChain());

		result.current.ensureCorrectChain(chainToSwitchTo.id);

		await waitFor(() => {
			expect(
				switchChainErrorModalStore.getSnapshot().context.chainIdToSwitchTo,
			).toBe(chainToSwitchTo.id);
		});
	});

	test('async version handles chain switch error correctly', async () => {
		const { result } = renderHook(() => useEnsureCorrectChain());

		await result.current.ensureCorrectChainAsync(chainToSwitchTo.id);

		expect(
			switchChainErrorModalStore.getSnapshot().context.chainIdToSwitchTo,
		).toBe(chainToSwitchTo.id);
	});

	test('closes error modal when successfully switched to target chain', async () => {
		const { result } = renderHook(() => useEnsureCorrectChain());

		await waitFor(() => {
			expect(result.current.currentChainId).toBeDefined();
		});

		// Now open the modal for the same chain the user is already on
		// This should trigger the effect to close it immediately
		switchChainErrorModalStore.send({
			type: 'open',
			chainIdToSwitchTo: result.current.currentChainId!,
		});

		// The effect should close the modal since we're already on the target chain
		await waitFor(() => {
			expect(
				switchChainErrorModalStore.getSnapshot().context.chainIdToSwitchTo,
			).toBeUndefined();
		});
	});
});
