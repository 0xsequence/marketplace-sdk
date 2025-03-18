import {
	fireEvent,
	render,
	renderHook,
	screen,
	wagmiConfig,
	waitFor,
} from '@test';
import { describe, expect, test, vi } from 'vitest';
import { type Config, useChainId } from 'wagmi';
import SwitchChainModal, { useSwitchChainModal } from '../index';
import { switchChainModal$ } from '../store';

const chainToSwitchTo = wagmiConfig.chains[1];

describe('SwitchChainModal', () => {
	test('opens switch chain modal with correct chain', async () => {
		render(<SwitchChainModal />);

		const { show } = useSwitchChainModal();
		show({ chainIdToSwitchTo: chainToSwitchTo.id });

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
		render(<SwitchChainModal />);

		const { show, close } = useSwitchChainModal();

		show({ chainIdToSwitchTo: chainToSwitchTo.id });

		close();

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

	test.skip('shows spinner while switching chain', async () => {
		render(<SwitchChainModal />);
		const { show } = useSwitchChainModal();

		show({ chainIdToSwitchTo: chainToSwitchTo.id });

		const switchButton = await screen.findByRole('button', {
			name: /switch network/i,
		});
		expect(switchButton).toBeInTheDocument();

		fireEvent.click(switchButton);

		await waitFor(() => {
			const spinner = screen.findByTestId('switch-chain-spinner');
			expect(spinner).toBeInTheDocument();
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

		const mockConnector = {
			...wagmiConfig.connectors[0],
			features: {
				// @ts-expect-error
				...wagmiConfig.connectors[0].features,
				switchChainError: true,
			},
		};
		const wagmiConfigWithSwitchChainError = {
			...wagmiConfig,
			connectors: [mockConnector],
		} as Config;

		render(<SwitchChainModal />, {
			wagmiConfig: wagmiConfigWithSwitchChainError,
		});

		const { show } = useSwitchChainModal();
		show({ chainIdToSwitchTo: chainToSwitchTo.id, onError });

		const switchButton = await screen.findByRole('button', {
			name: /switch network/i,
		});
		fireEvent.click(switchButton);

		await waitFor(() => {
			// const chainId = renderHook(() => useChainId()).result.current
			// expect(chainId).not.toBe(chainToSwitchTo.id)
			expect(onError).toHaveBeenCalled();
			expect(switchChainModal$.isOpen.get()).toBe(true);
		});
	});
});
