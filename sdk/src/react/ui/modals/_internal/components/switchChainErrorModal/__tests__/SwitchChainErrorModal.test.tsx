import { render, renderHook, screen, wagmiConfig, waitFor } from '@test';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { useAccount } from 'wagmi';
import SwitchChainErrorModal, { useSwitchChainErrorModal } from '../index';
import { switchChainErrorModalStore } from '../store';

vi.mock('wagmi', async () => {
	const actual = await vi.importActual('wagmi');
	return {
		...actual,
		useAccount: vi.fn(),
	};
});

const mockUseAccount = vi.mocked(useAccount);

const chainToSwitchTo = wagmiConfig.chains[1]; //Polygon

describe('SwitchChainErrorModal', () => {
	beforeEach(() => {
		// Reset store to initial state
		switchChainErrorModalStore.send({ type: 'close' });
		vi.clearAllMocks();

		mockUseAccount.mockReturnValue({
			chainId: wagmiConfig.chains[0].id,
			isConnected: true,
		} as any);
	});

	test('opens switch chain error modal with correct chain', async () => {
		const { result } = renderHook(() => useSwitchChainErrorModal());

		result.current.show({ chainIdToSwitchTo: chainToSwitchTo.id });
		render(<SwitchChainErrorModal />);

		await waitFor(() => {
			const titleElement = screen.getByText('Switching network failed');
			expect(titleElement).toBeInTheDocument();
		});

		const titleElement = await screen.findByText('Switching network failed');
		expect(titleElement).toBeInTheDocument();

		const messageElement = await screen.findByText(
			`There was an error switching to ${chainToSwitchTo.name}. Please try changing the network in your wallet manually.`,
		);
		expect(messageElement).toBeInTheDocument();
	});

	test('closes switch chain modal using close callback', async () => {
		const { result } = renderHook(() => useSwitchChainErrorModal());

		result.current.show({ chainIdToSwitchTo: chainToSwitchTo.id });
		render(<SwitchChainErrorModal />);

		switchChainErrorModalStore.send({ type: 'close' });

		const titleElement = screen.queryByText('Switching network failed');
		await waitFor(() => {
			expect(titleElement).not.toBeInTheDocument();
		});
	});

	test('does not show modal if current chain matches target chain', () => {
		// Mock user already being on Polygon
		mockUseAccount.mockReturnValue({
			chainId: chainToSwitchTo.id,
			isConnected: true,
		} as any);

		const { result } = renderHook(() => useSwitchChainErrorModal());
		result.current.show({ chainIdToSwitchTo: chainToSwitchTo.id });

		render(<SwitchChainErrorModal />);

		const titleElement = screen.queryByText('Switching network failed');
		expect(titleElement).not.toBeInTheDocument();
	});
});
