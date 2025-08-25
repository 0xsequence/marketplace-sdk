import { renderHook, wagmiConfig, waitFor } from '@test';
import { SwitchChainError } from 'viem';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { useAccount, useSwitchChain } from 'wagmi';
import { switchChainErrorModalStore } from '../../../ui/modals/_internal/components/switchChainErrorModal/store';
import { useEnsureCorrectChain } from '../useEnsureCorrectChain';

vi.mock('wagmi', async () => {
	const actual = await vi.importActual('wagmi');
	return {
		...actual,
		useAccount: vi.fn(),
		useSwitchChain: vi.fn(),
	};
});

const mockUseAccount = vi.mocked(useAccount);
const mockUseSwitchChain = vi.mocked(useSwitchChain);

const currentChain = wagmiConfig.chains[0]; // mainnet
const chainToSwitchTo = wagmiConfig.chains[1]; // polygon

describe('useEnsureCorrectChain', () => {
	beforeEach(() => {
		switchChainErrorModalStore.send({ type: 'close' });
		vi.clearAllMocks();

		mockUseAccount.mockReturnValue({
			chainId: currentChain.id,
			isConnected: true,
		} as any);

		mockUseSwitchChain.mockReturnValue({
			switchChain: vi.fn(),
			switchChainAsync: vi.fn().mockImplementation(async ({ chainId }) => {
				const connector = wagmiConfig.connectors[0];
				return connector?.switchChain?.(chainId);
			}),
		} as any);
	});

	test('returns current chain id', () => {
		const { result } = renderHook(() => useEnsureCorrectChain());
		expect(result.current.currentChainId).toBe(currentChain.id);
	});

	test('does nothing if already on correct chain', () => {
		const { result } = renderHook(() => useEnsureCorrectChain());
		const onSuccess = vi.fn();

		result.current.ensureCorrectChain(currentChain.id, { onSuccess });

		expect(onSuccess).toHaveBeenCalled();
		expect(mockUseSwitchChain().switchChain).not.toHaveBeenCalled();
	});

	test('attempts to switch chain and shows error modal when switch fails', async () => {
		mockUseSwitchChain.mockReturnValue({
			switchChain: vi.fn().mockImplementation((_, { onError }) => {
				onError?.(new SwitchChainError(new Error('Failed to switch chain')));
			}),
			switchChainAsync: vi.fn(),
		} as any);

		const { result } = renderHook(() => useEnsureCorrectChain());

		result.current.ensureCorrectChain(chainToSwitchTo.id);

		await waitFor(() => {
			expect(
				switchChainErrorModalStore.getSnapshot().context.chainIdToSwitchTo,
			).toBe(chainToSwitchTo.id);
		});
	});

	test('async version handles chain switch error correctly', async () => {
		mockUseSwitchChain.mockReturnValue({
			switchChain: vi.fn(),
			switchChainAsync: vi
				.fn()
				.mockRejectedValue(
					new SwitchChainError(new Error('Failed to switch chain')),
				),
		} as any);

		const { result } = renderHook(() => useEnsureCorrectChain());

		await result.current.ensureCorrectChainAsync(chainToSwitchTo.id);

		expect(
			switchChainErrorModalStore.getSnapshot().context.chainIdToSwitchTo,
		).toBe(chainToSwitchTo.id);
	});

	test('closes error modal when successfully switched to target chain', async () => {
		switchChainErrorModalStore.send({
			type: 'open',
			chainIdToSwitchTo: chainToSwitchTo.id,
		});

		mockUseAccount.mockReturnValue({
			chainId: chainToSwitchTo.id,
			isConnected: true,
		} as any);

		renderHook(() => useEnsureCorrectChain());

		await waitFor(() => {
			expect(
				switchChainErrorModalStore.getSnapshot().context.chainIdToSwitchTo,
			).toBeUndefined();
		});
	});
});
