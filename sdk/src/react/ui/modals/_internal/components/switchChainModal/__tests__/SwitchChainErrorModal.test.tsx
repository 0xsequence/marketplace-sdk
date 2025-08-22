import { render, renderHook, screen, wagmiConfig, waitFor } from '@test';
import { beforeEach, describe, expect, test } from 'vitest';
import SwitchChainErrorModal, { useSwitchChainErrorModal } from '../index';
import { switchChainModalStore } from '../store';

const chainToSwitchTo = wagmiConfig.chains[1];

describe('SwitchChainErrorModal', () => {
	beforeEach(() => {
		// Reset store to initial state
		switchChainModalStore.send({ type: 'close' });
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

		switchChainModalStore.send({ type: 'close' });

		const titleElement = screen.queryByText('Switching network failed');
		await waitFor(() => {
			expect(titleElement).not.toBeInTheDocument();
		});
	});
});
