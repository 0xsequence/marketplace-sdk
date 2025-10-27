import { cleanup, render, renderHook, screen, waitFor } from '@test';
import { TEST_COLLECTIBLE, USDC_ADDRESS } from '@test/const';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StepType, WalletKind } from '../../../../_internal';
import {
	createMockStep,
	mockOrder,
} from '../../../../_internal/api/__mocks__/marketplace.msw';
import * as hooksModule from '../../../../hooks';
import { useSellModal } from '..';
import * as useGetTokenApprovalDataModule from '../hooks/useGetTokenApproval';
import { SellModal } from '../Modal';

const testOrder = {
	...mockOrder,
	priceCurrencyAddress: USDC_ADDRESS,
	collectionContractAddress: TEST_COLLECTIBLE.collectionAddress,
};

const defaultArgs = {
	collectionAddress: TEST_COLLECTIBLE.collectionAddress,
	chainId: TEST_COLLECTIBLE.chainId,
	tokenId: TEST_COLLECTIBLE.collectibleId,
	order: testOrder,
};

describe('SellModal', () => {
	beforeEach(() => {
		cleanup();
		// Reset all mocks
		vi.clearAllMocks();
		vi.resetAllMocks();
		vi.restoreAllMocks();
	});

	it('should show main button if there is no approval step', async () => {
		vi.spyOn(hooksModule, 'useConnectorMetadata').mockReturnValue({
			isWaaS: false,
			isSequence: true,
			walletKind: WalletKind.sequence,
		});

		// Mock useGetTokenApprovalData to return no approval step for Sequence wallets
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
			error: null,
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
		vi.spyOn(hooksModule, 'useConnectorMetadata').mockReturnValue({
			isWaaS: false,
			isSequence: false,
			walletKind: WalletKind.unknown,
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
			error: null,
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
