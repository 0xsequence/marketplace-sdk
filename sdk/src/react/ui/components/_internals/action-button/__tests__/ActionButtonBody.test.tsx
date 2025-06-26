'use client';

import { fireEvent, render, screen } from '@test';
import { createMockWallet } from '@test/mocks/wallet';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CollectibleCardAction } from '../../../../../../types';
import * as walletModule from '../../../../../_internal/wallet/useWallet';
import * as hooksModule from '../../../../../hooks';
import { ActionButtonBody } from '../components/ActionButtonBody';
import { setPendingAction } from '../store';

vi.mock('../store', () => ({
	setPendingAction: vi.fn(),
}));

vi.mock('../../../../../hooks', () => ({
	useOpenConnectModal: vi.fn(),
}));

describe('ActionButtonBody', () => {
	const mockOnClick = vi.fn();
	const mockOpenConnectModal = vi.fn();
	const defaultProps = {
		label: 'Buy now' as const,
		tokenId: '123',
		onClick: mockOnClick,
		action: CollectibleCardAction.BUY as CollectibleCardAction.BUY,
	};

	beforeEach(() => {
		vi.clearAllMocks();

		vi.spyOn(walletModule, 'useWallet').mockReturnValue({
			wallet: createMockWallet(),
			isLoading: false,
			isError: false,
		});

		vi.spyOn(hooksModule, 'useOpenConnectModal').mockReturnValue({
			openConnectModal: mockOpenConnectModal,
		});
	});

	it('executes onClick directly when user is connected', () => {
		render(<ActionButtonBody {...defaultProps} />);

		const button = screen.getByRole('button', { name: defaultProps.label });
		fireEvent.click(button);

		expect(mockOnClick).toHaveBeenCalledTimes(1);
		expect(setPendingAction).not.toHaveBeenCalled();
	});

	it('sets pending action and opens connect modal when user is not connected', () => {
		vi.spyOn(walletModule, 'useWallet').mockReturnValue({
			wallet: {
				...createMockWallet(),
				// @ts-expect-error - address is undefined for testing
				address: undefined,
			},
			isLoading: false,
			isError: false,
		});
		render(<ActionButtonBody {...defaultProps} />);

		const button = screen.getByRole('button', { name: defaultProps.label });
		fireEvent.click(button);

		expect(mockOnClick).not.toHaveBeenCalled();
		expect(setPendingAction).toHaveBeenCalledWith(
			defaultProps.action,
			defaultProps.onClick,
			defaultProps.tokenId,
		);
		expect(mockOpenConnectModal).toHaveBeenCalledTimes(1);
	});
});
