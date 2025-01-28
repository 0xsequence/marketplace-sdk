import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import SwitchChainModal, { useSwitchChainModal } from '../index';
import { switchChainModal$, initialState } from '../store';

expect.extend(matchers);

const mockSwitchChainAsync = vi
	.fn()
	.mockImplementation(() => Promise.resolve());

vi.mock('wagmi', () => ({
	useSwitchChain: () => ({
		switchChainAsync: mockSwitchChainAsync,
	}),
}));

vi.mock('../../../../../_internal', () => ({
	getProviderEl: () => document.body,
}));

describe('SwitchChainModal', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		switchChainModal$.set({
			...initialState,
			open: initialState.open.bind(switchChainModal$),
			close: initialState.close.bind(switchChainModal$),
		});
	});

	afterEach(() => {
		cleanup();
		switchChainModal$.set({
			...initialState,
			open: initialState.open.bind(switchChainModal$),
			close: initialState.close.bind(switchChainModal$),
		});
	});

	test('opens switch chain modal with correct chain', async () => {
		render(<SwitchChainModal />);

		const { show } = useSwitchChainModal();
		show({ chainIdToSwitchTo: '1' });

		expect(switchChainModal$.isOpen.get()).toBe(true);
		expect(switchChainModal$.state.chainIdToSwitchTo.get()).toBe('1');

		const titleElement = await screen.findByText('Wrong network');
		expect(titleElement).toBeInTheDocument();

		const messageElement = await screen.findByText(
			/You need to switch to mainnet network before completing the transaction/,
		);
		expect(messageElement).toBeInTheDocument();

		const buttonElement = await screen.findByRole('button', {
			name: 'Switch Network',
		});
		expect(buttonElement).toBeInTheDocument();
	});

	test('closes switch chain modal and resets state', async () => {
		render(<SwitchChainModal />);

		const { show } = useSwitchChainModal();

		show({ chainIdToSwitchTo: '1' });
		expect(switchChainModal$.isOpen.get()).toBe(true);
		expect(switchChainModal$.state.chainIdToSwitchTo.get()).toBe('1');

		switchChainModal$.set({
			...initialState,
			open: initialState.open.bind(switchChainModal$),
			close: initialState.close.bind(switchChainModal$),
		});

		expect(switchChainModal$.isOpen.get()).toBe(false);
		expect(switchChainModal$.state.chainIdToSwitchTo.get()).toBe(undefined);

		const titleElement = screen.queryByText('Wrong network');
		expect(titleElement).not.toBeInTheDocument();
	});

	test('clicking Switch Network button triggers chain switch', async () => {
		render(<SwitchChainModal />);
		const { show } = useSwitchChainModal();

		show({ chainIdToSwitchTo: '1', onError: () => {} });

		const switchButton = await screen.findByRole('button', {
			name: 'Switch Network',
		});
		expect(switchButton).toBeInTheDocument();

		fireEvent.click(switchButton);

		expect(mockSwitchChainAsync).toHaveBeenCalledWith({ chainId: 1 });

		await vi.waitFor(
			() => {
				expect(switchChainModal$.isOpen.get()).toBe(true);
			},
			{ timeout: 1000 },
		);

		expect(switchChainModal$.state.isSwitching.get()).toBe(false);
	});

	test('shows spinner while switching chain', async () => {
		mockSwitchChainAsync.mockImplementationOnce(
			() => new Promise((resolve) => setTimeout(resolve, 100)),
		);

		render(<SwitchChainModal />);
		const { show } = useSwitchChainModal();

		show({ chainIdToSwitchTo: '1' });

		const switchButton = await screen.findByRole('button', {
			name: 'Switch Network',
		});
		expect(switchButton).toBeInTheDocument();

		fireEvent.click(switchButton);

		expect(switchChainModal$.state.isSwitching.get()).toBe(true);

		const spinner = await screen.findByTestId('switch-chain-spinner');
		expect(spinner).toBeInTheDocument();

		await vi.waitFor(
			() => {
				expect(switchChainModal$.state.isSwitching.get()).toBe(false);
				expect(
					screen.queryByTestId('switch-chain-spinner'),
				).not.toBeInTheDocument();
				const button = screen.getByRole('button', {
					name: 'Switch Network',
				});
				expect(button).toBeInTheDocument();
			},
			{ timeout: 1000 },
		);
	});

	test('handles chain switching failure correctly', async () => {
		const mockError = new Error('Failed to switch chain');
		mockSwitchChainAsync.mockRejectedValueOnce(mockError);

		const mockOnError = vi.fn();
		render(<SwitchChainModal />);
		const { show } = useSwitchChainModal();

		show({ chainIdToSwitchTo: '1', onError: mockOnError });

		const switchButton = await screen.findByRole('button', {
			name: 'Switch Network',
		});
		expect(switchButton).toBeInTheDocument();

		fireEvent.click(switchButton);

		await vi.waitFor(() => {
			expect(mockOnError).toHaveBeenCalledWith(mockError);
		});

		expect(switchChainModal$.isOpen.get()).toBe(true);
		expect(switchChainModal$.state.isSwitching.get()).toBe(false);

		const buttonAfterError = screen.getByRole('button', {
			name: 'Switch Network',
		});
		expect(buttonAfterError).toBeEnabled();
	});
});
