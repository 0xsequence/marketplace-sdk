'use client';

import { fireEvent, render, screen } from '@test';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as wagmi from 'wagmi';
import { CollectibleCardAction } from '../../../../../../types';
import * as hooksModule from '../../../../../hooks';
import { ActionButtonBody } from '../components/ActionButtonBody';
import { useActionButtonStore } from '../store';

vi.mock('../store', () => ({
	useActionButtonStore: vi.fn(() => ({
		setPendingAction: vi.fn(),
	})),
}));

vi.mock('../../../../../hooks/ui/useOpenConnectModal', () => ({
	useOpenConnectModal: vi.fn(),
}));

vi.mock('wagmi', async () => {
	const actual = await vi.importActual('wagmi');
	return {
		...actual,
		useAccount: vi.fn(),
	};
});

describe('ActionButtonBody', () => {
	const mockOnClick = vi.fn();
	const mockOpenConnectModal = vi.fn();
	const mockSetPendingAction = vi.fn();
	const defaultProps = {
		label: 'Buy now' as const,
		tokenId: 123n,
		onClick: mockOnClick,
		action: CollectibleCardAction.BUY as CollectibleCardAction.BUY,
	};

	beforeEach(() => {
		vi.clearAllMocks();

		// Default to connected state
		vi.mocked(wagmi.useAccount).mockReturnValue({
			address: '0x1234567890123456789012345678901234567890' as `0x${string}`,
			addresses: [
				'0x1234567890123456789012345678901234567890' as `0x${string}`,
			],
			chain: undefined,
			chainId: 1,
			connector: {} as any,
			isConnected: true,
			isConnecting: false,
			isDisconnected: false,
			isReconnecting: false,
			status: 'connected',
		});

		vi.mocked(hooksModule.useOpenConnectModal).mockReturnValue({
			openConnectModal: mockOpenConnectModal,
		});

		(useActionButtonStore as ReturnType<typeof vi.fn>).mockReturnValue({
			setPendingAction: mockSetPendingAction,
		});
	});

	it('executes onClick directly when user is connected', () => {
		render(<ActionButtonBody {...defaultProps} />);

		const button = screen.getByRole('button', { name: defaultProps.label });
		fireEvent.click(button);

		expect(mockOnClick).toHaveBeenCalledTimes(1);
		expect(mockSetPendingAction).not.toHaveBeenCalled();
	});

	it('sets pending action and opens connect modal when user is not connected', () => {
		// Mock disconnected state
		vi.mocked(wagmi.useAccount).mockReturnValue({
			address: undefined,
			addresses: undefined,
			chain: undefined,
			chainId: undefined,
			connector: undefined,
			isConnected: false,
			isConnecting: false,
			isDisconnected: true,
			isReconnecting: false,
			status: 'disconnected',
		});

		render(<ActionButtonBody {...defaultProps} />);

		const button = screen.getByRole('button', { name: defaultProps.label });
		fireEvent.click(button);

		expect(mockOnClick).not.toHaveBeenCalled();
		expect(mockSetPendingAction).toHaveBeenCalledWith(
			defaultProps.action,
			defaultProps.onClick,
			defaultProps.tokenId,
		);
		expect(mockOpenConnectModal).toHaveBeenCalledTimes(1);
	});
});
