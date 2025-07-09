'use client';

import { fireEvent, render, screen } from '@test';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import { CollectibleCardAction } from '../../../../../../types';
import * as hooksModule from '../../../../../hooks';
import { ActionButtonBody } from '../components/ActionButtonBody';
import { useActionButtonStore } from '../store';

vi.mock('../store', () => ({
	useActionButtonStore: vi.fn(() => ({
		setPendingAction: vi.fn(),
	})),
}));

vi.mock('../../../../../hooks', () => ({
	useOpenConnectModal: vi.fn(),
}));

vi.mock('wagmi', () => ({
	useAccount: vi.fn(),
}));

describe('ActionButtonBody', () => {
	const mockOnClick = vi.fn();
	const mockOpenConnectModal = vi.fn();
	const mockSetPendingAction = vi.fn();
	const defaultProps = {
		label: 'Buy now' as const,
		tokenId: '123',
		onClick: mockOnClick,
		action: CollectibleCardAction.BUY as CollectibleCardAction.BUY,
	};

	beforeEach(() => {
		vi.clearAllMocks();

		// Mock useAccount from wagmi to return a connected user by default
		vi.mocked(useAccount).mockReturnValue({
			address: '0x1234567890123456789012345678901234567890',
		} as any);

		vi.spyOn(hooksModule, 'useOpenConnectModal').mockReturnValue({
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
		// Mock useAccount to return no address (disconnected user)
		vi.mocked(useAccount).mockReturnValue({
			address: undefined,
		} as any);
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
