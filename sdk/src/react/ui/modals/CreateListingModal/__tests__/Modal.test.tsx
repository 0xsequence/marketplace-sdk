import { cleanup, render, renderHook, screen, waitFor } from '@test';
import { TEST_COLLECTIBLE } from '@test/const';

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StepType } from '../../../../_internal';
import { createMockStep } from '../../../../_internal/api/__mocks__/marketplace.msw';

import { useCreateListingModal } from '..';
import * as useGetTokenApprovalDataModule from '../hooks/useGetTokenApproval';
import { CreateListingModal } from '../Modal';

const defaultArgs = {
	collectionAddress: TEST_COLLECTIBLE.collectionAddress,
	chainId: TEST_COLLECTIBLE.chainId,
	collectibleId: TEST_COLLECTIBLE.collectibleId,
};

describe('MakeOfferModal', () => {
	beforeEach(() => {
		cleanup();
		// Reset all mocks
		vi.clearAllMocks();
		vi.resetAllMocks();
		vi.restoreAllMocks();
	});

	it('should show main button if there is no approval step', async () => {
		vi.spyOn(
			useGetTokenApprovalDataModule,
			'useGetTokenApprovalData',
		).mockReturnValue({
			data: {
				step: null,
			},
			isLoading: false,
			isSuccess: true,
		});

		// Render the modal
		const { result } = renderHook(() => useCreateListingModal());
		result.current.show(defaultArgs);

		render(<CreateListingModal />);

		// Wait for the component to update
		await waitFor(() => {
			// The Approve TOKEN button should not exist
			expect(screen.queryByText('Approve TOKEN')).toBeNull();

			// The List item for sale button should exist
			expect(
				screen.getByRole('button', { name: 'List item for sale' }),
			).toBeDefined();
		});
	});

	it('(non-sequence wallets) should show approve token button if there is an approval step, disable main button', async () => {
		vi.spyOn(
			useGetTokenApprovalDataModule,
			'useGetTokenApprovalData',
		).mockReturnValue({
			data: {
				step: createMockStep(StepType.tokenApproval),
			},
			isLoading: false,
			isSuccess: true,
		});

		// Render the modal
		const { result } = renderHook(() => useCreateListingModal());
		result.current.show(defaultArgs);

		render(<CreateListingModal />);

		await waitFor(() => {
			expect(screen.getByText('Approve TOKEN')).toBeDefined();

			expect(
				screen.getByRole('button', { name: 'List item for sale' }),
			).toBeDefined();
			expect(
				screen.getByRole('button', { name: 'List item for sale' }),
			).toBeDisabled();
		});
	});
});
