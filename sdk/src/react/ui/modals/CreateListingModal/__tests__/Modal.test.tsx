import { cleanup, render, renderHook, screen, waitFor } from '@test';
import { TEST_COLLECTIBLE } from '@test/const';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useCreateListingModal } from '..';
import { CreateListingModal } from '../Modal';

const defaultArgs = {
	collectionAddress: TEST_COLLECTIBLE.collectionAddress,
	chainId: TEST_COLLECTIBLE.chainId,
	collectibleId: TEST_COLLECTIBLE.collectibleId,
};

describe('CreateListingModal', () => {
	beforeEach(() => {
		cleanup();
		// Reset all mocks
		vi.clearAllMocks();
		vi.resetAllMocks();
		vi.restoreAllMocks();
	});

	it('should show create listing button', async () => {
		// Render the modal
		const { result } = renderHook(() => useCreateListingModal());
		result.current.show(defaultArgs);

		render(<CreateListingModal />);

		// Wait for the component to update
		await waitFor(() => {
			// The Create Listing button should exist
			expect(
				screen.getByRole('button', { name: 'Create Listing' }),
			).toBeDefined();
		});
	});

	it('should render the modal when opened', async () => {
		const { result } = renderHook(() => useCreateListingModal());
		result.current.show(defaultArgs);

		render(<CreateListingModal />);

		await waitFor(() => {
			expect(screen.getByText('List item for sale')).toBeDefined();
		});
	});
});
