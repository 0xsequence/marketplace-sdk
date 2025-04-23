import {
	fireEvent,
	render,
	renderHook,
	screen,
	wagmiConfig,
	waitFor,
} from '@test';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { useChainId } from 'wagmi';
import SwitchChainModal, { useSwitchChainModal } from '../index';
import { switchChainModal$ } from '../store';

const chainToSwitchTo = wagmiConfig.chains[1];

describe('SwitchChainModal', () => {
	beforeEach(() => {
		switchChainModal$.state.isSwitching.set(false);
		switchChainModal$.state.chainIdToSwitchTo.set(undefined);
		switchChainModal$.state.onError.set(undefined);
		switchChainModal$.state.onSuccess.set(undefined);
		switchChainModal$.state.onClose.set(undefined);
	});

	test('opens switch chain modal with correct chain', async () => {
		const { result } = renderHook(() => useSwitchChainModal());

		result.current.show({ chainIdToSwitchTo: chainToSwitchTo.id });
		render(<SwitchChainModal />);

		await waitFor(() => {
			const titleElement = screen.getByText('Wrong network');
			expect(titleElement).toBeInTheDocument();
		});

		const titleElement = await screen.findByText('Wrong network');
		expect(titleElement).toBeInTheDocument();

		const messageElement = await screen.findByText(
			`You need to switch to ${chainToSwitchTo.name} network before completing the transaction`,
		);
		expect(messageElement).toBeInTheDocument();

		const buttonElement = await screen.findByRole('button', {
			name: /switch network/i,
		});
		expect(buttonElement).toBeInTheDocument();
	});

	test('closes switch chain modal using close callback', async () => {
		const { result } = renderHook(() => useSwitchChainModal());

		result.current.show({ chainIdToSwitchTo: chainToSwitchTo.id });
		render(<SwitchChainModal />);

		result.current.close();

		const titleElement = screen.queryByText('Wrong network');
		await waitFor(() => {
			expect(titleElement).not.toBeInTheDocument();
		});
	});

	test('clicking Switch Network button triggers chain switch', async () => {
		render(<SwitchChainModal />);
		const { show } = useSwitchChainModal();

		show({ chainIdToSwitchTo: chainToSwitchTo.id });

		const switchButton = await screen.findByRole('button', {
			name: /switch network/i,
		});
		expect(switchButton).toBeInTheDocument();

		fireEvent.click(switchButton);

		await waitFor(() => {
			const chainId = renderHook(() => useChainId()).result.current;
			expect(chainId).toBe(chainToSwitchTo.id);
		});
	});

	test('shows spinner while switching chain', async () => {
		switchChainModal$.state.isSwitching.set(true);
		switchChainModal$.state.chainIdToSwitchTo.set(chainToSwitchTo.id);

		render(<SwitchChainModal />);

		const spinner = screen.getByTestId('switch-chain-spinner');
		expect(spinner).toBeInTheDocument();
	});

	test('shows error message when chain switch fails', async () => {
		const mockOnError = vi.fn();
		const { result } = renderHook(() => useSwitchChainModal());

		result.current.show({
			// @ts-expect-error - invalid chain id to trigger error
			chainIdToSwitchTo: 'invalid-chain-id',
			onError: mockOnError,
		});
		render(<SwitchChainModal />);

		const button = await screen.findByRole('button', {
			name: /switch network/i,
		});
		fireEvent.click(button);

		await waitFor(() => {
			expect(mockOnError).toHaveBeenCalledOnce();
		});
	});
});
