import { cleanup, fireEvent, render, screen, waitFor } from '@test';
import * as matchers from '@testing-library/jest-dom/matchers';
import type { SwitchChainError } from 'viem';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import SwitchChainModal, { useSwitchChainModal } from '../index';
import { initialState, switchChainModal$ } from '../store';

expect.extend(matchers);

const mockSwitchChainAsync = vi
	.fn()
	.mockImplementation(() => Promise.resolve({}));

vi.mock('wagmi', async () => {
	const actual = await vi.importActual<typeof import('wagmi')>('wagmi');
	return {
		...(actual ?? {}),
		useSwitchChain: () => ({
			switchChainAsync: mockSwitchChainAsync,
		}),
	};
});

vi.mock('../../../../../_internal', () => ({
	getProviderEl: () => document.body,
}));

describe('SwitchChainModal', () => {
	beforeEach(() => {
		cleanup();
		vi.clearAllMocks();
		vi.resetAllMocks();

		switchChainModal$.set({
			...initialState,
			open: initialState.open.bind(switchChainModal$),
			close: initialState.close.bind(switchChainModal$),
		});
	});

	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
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
			name: /switch network/i,
		});
		expect(buttonElement).toBeInTheDocument();
	});

	test('closes switch chain modal using close callback', async () => {
		render(<SwitchChainModal />);

		const { show, close } = useSwitchChainModal();
		show({ chainIdToSwitchTo: '1' });

		expect(switchChainModal$.isOpen.get()).toBe(true);
		expect(switchChainModal$.state.chainIdToSwitchTo.get()).toBe('1');

		close();

		await waitFor(() => {
			expect(switchChainModal$.isOpen.get()).toBe(undefined);
			expect(switchChainModal$.state.chainIdToSwitchTo.get()).toBe(undefined);
		});

		const titleElement = screen.queryByText('Wrong network');
		expect(titleElement).not.toBeInTheDocument();
	});

	test('clicking Switch Network button triggers chain switch', async () => {
		render(<SwitchChainModal />);
		const { show } = useSwitchChainModal();

		show({ chainIdToSwitchTo: '1', onError: () => {} });

		const switchButton = await screen.findByRole('button', {
			name: /switch network/i,
		});
		expect(switchButton).toBeInTheDocument();

		fireEvent.click(switchButton);

		expect(mockSwitchChainAsync).toHaveBeenCalledWith({ chainId: 1 });

		await waitFor(() => {
			expect(switchChainModal$.isOpen.get()).toBe(undefined);
			expect(switchChainModal$.state.isSwitching.get()).toBe(false);
		});
	});

	test('shows spinner while switching chain', async () => {
		mockSwitchChainAsync.mockImplementationOnce(
			() => new Promise((resolve) => setTimeout(resolve, 100)),
		);

		render(<SwitchChainModal />);
		const { show } = useSwitchChainModal();

		show({ chainIdToSwitchTo: '1' });

		const switchButton = await screen.findByRole('button', {
			name: /switch network/i,
		});
		expect(switchButton).toBeInTheDocument();

		fireEvent.click(switchButton);

		await waitFor(() => {
			expect(switchChainModal$.state.isSwitching.get()).toBe(true);
		});

		const spinner = document.querySelector('.spinner');
		expect(spinner).toBeInTheDocument();

		await waitFor(() => {
			expect(switchChainModal$.state.isSwitching.get()).toBe(false);
			expect(document.querySelector('.spinner')).not.toBeInTheDocument();
		});
	});

	test('calls onError callback when switching chain fails', async () => {
		const mockError = new Error(
			'Failed to switch chain',
		) as unknown as SwitchChainError;
		mockSwitchChainAsync.mockRejectedValueOnce(mockError);
		const onError = vi.fn();

		render(<SwitchChainModal />);

		const { show } = useSwitchChainModal();
		show({ chainIdToSwitchTo: '1', onError });

		const switchButton = await screen.findByRole('button', {
			name: /switch network/i,
		});
		fireEvent.click(switchButton);

		await waitFor(() => {
			expect(onError).toHaveBeenCalledWith(mockError);
			expect(switchChainModal$.isOpen.get()).toBe(true);
		});
	});
});
