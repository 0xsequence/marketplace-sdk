import { cleanup, render, renderHook, screen, waitFor } from '@test';
import { TEST_COLLECTIBLE } from '@test/const';
import { createMockWallet } from '@test/mocks/wallet';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSellModal } from '..';
import { StepType, WalletKind } from '../../../../_internal';
import { createMockStep } from '../../../../_internal/api/__mocks__/marketplace.msw';
import { mockOrder } from '../../../../_internal/api/__mocks__/marketplace.msw';
import * as walletModule from '../../../../_internal/wallet/useWallet';
import { SellModal } from '../Modal';
import * as useGetTokenApprovalDataModule from '../hooks/useGetTokenApproval';

const defaultArgs = {
	collectionAddress: TEST_COLLECTIBLE.collectionAddress,
	chainId: TEST_COLLECTIBLE.chainId,
	tokenId: TEST_COLLECTIBLE.collectibleId,
	order: mockOrder,
};

describe('MakeOfferModal', () => {
	const mockWallet = createMockWallet();

	beforeEach(() => {
		cleanup();
		// Reset all mocks
		vi.clearAllMocks();
		vi.resetAllMocks();
		vi.restoreAllMocks();
	});

	it('should show main button if there is no approval step', async () => {
		// Mock sequence wallet
		const sequenceWallet = {
			...mockWallet,
			walletKind: WalletKind.sequence,
		};
		vi.spyOn(walletModule, 'useWallet').mockReturnValue({
			wallet: sequenceWallet,
			isLoading: false,
			isError: false,
		});
		vi.spyOn(
			useGetTokenApprovalDataModule,
			'useGetTokenApprovalData',
		).mockReturnValue({
			data: {
				step: null,
			},
			isLoading: false,
			isSuccess: true,
			isError: false,
		});

		// Render the modal
		const { result } = renderHook(() => useSellModal());
		result.current.show(defaultArgs);

		render(<SellModal />);

		// Wait for the component to update
		await waitFor(() => {
			// The Approve TOKEN button should not exist
			expect(screen.queryByText('Approve TOKEN')).toBeNull();

			// The Accept button should exist
			expect(screen.getByRole('button', { name: 'Accept' })).toBeDefined();
		});
	});

	it('(non-sequence wallets) should show approve token button if there is an approval step, disable main button', async () => {
		const nonSequenceWallet = {
			...mockWallet,
			walletKind: 'unknown' as WalletKind,
		};
		vi.spyOn(walletModule, 'useWallet').mockReturnValue({
			wallet: nonSequenceWallet,
			isLoading: false,
			isError: false,
		});
		vi.spyOn(
			useGetTokenApprovalDataModule,
			'useGetTokenApprovalData',
		).mockReturnValue({
			data: {
				step: createMockStep(StepType.tokenApproval),
			},
			isLoading: false,
			isSuccess: true,
			isError: false,
		});

		// Render the modal
		const { result } = renderHook(() => useSellModal());
		result.current.show(defaultArgs);

		render(<SellModal />);

		await waitFor(() => {
			expect(screen.getByText('Approve TOKEN')).toBeDefined();

			expect(screen.getByRole('button', { name: 'Accept' })).toBeDefined();
			expect(screen.getByRole('button', { name: 'Accept' })).toBeDisabled();
		});
	});
});
