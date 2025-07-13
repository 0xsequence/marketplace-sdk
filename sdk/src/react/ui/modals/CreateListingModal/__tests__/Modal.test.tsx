import { cleanup, render, renderHook, screen, waitFor } from '@test';
import { TEST_COLLECTIBLE } from '@test/const';
import { createMockWallet } from '@test/mocks/wallet';
import type { Hex } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OrderbookKind } from '../../../../../types';
import { StepType, WalletKind } from '../../../../_internal';
import { createMockStep } from '../../../../_internal/api/__mocks__/marketplace.msw';
import * as walletModule from '../../../../_internal/wallet/useWallet';
import { useCreateListingModal } from '..';
import * as useGetTokenApprovalDataModule from '../hooks/useGetTokenApproval';
import { CreateListingModal } from '../Modal';
import { createListingModalStore } from '../store';

const defaultArgs = {
	collectionAddress: TEST_COLLECTIBLE.collectionAddress,
	chainId: TEST_COLLECTIBLE.chainId,
	collectibleId: TEST_COLLECTIBLE.collectibleId,
};

describe('MakeOfferModal', () => {
	const mockWallet = createMockWallet();

	beforeEach(() => {
		cleanup();
		// Reset all mocks
		vi.clearAllMocks();
		vi.resetAllMocks();
		vi.restoreAllMocks();
		// Reset store state
		createListingModalStore.send({ type: 'close' });
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

describe('CreateListingModal Store', () => {
	beforeEach(() => {
		createListingModalStore.send({ type: 'close' });
	});

	it('should open modal with correct initial state', () => {
		const openArgs = {
			collectionAddress: '0x123' as Hex,
			chainId: 1,
			collectibleId: '1',
		};

		createListingModalStore.send({ type: 'open', ...openArgs });

		const state = createListingModalStore.getSnapshot();
		expect(state.context.isOpen).toBe(true);
		expect(state.context.collectionAddress).toBe(openArgs.collectionAddress);
		expect(state.context.chainId).toBe(openArgs.chainId);
		expect(state.context.collectibleId).toBe(openArgs.collectibleId);
	});

	it('should reset state when closing modal', () => {
		// Open modal first
		createListingModalStore.send({
			type: 'open',
			collectionAddress: '0x123' as Hex,
			chainId: 1,
			collectibleId: '1',
		});

		// Modify some state
		createListingModalStore.send({
			type: 'updateQuantity',
			quantity: '5',
		});

		// Close modal
		createListingModalStore.send({ type: 'close' });

		const state = createListingModalStore.getSnapshot();
		expect(state.context.isOpen).toBe(false);
		expect(state.context.quantity).toBe('1'); // Reset to initial
	});

	it('should update listing price correctly', () => {
		const newPrice = {
			amountRaw: '100',
			currency: { contractAddress: '0x456' } as any,
		};

		createListingModalStore.send({
			type: 'updateListingPrice',
			price: newPrice,
		});

		const state = createListingModalStore.getSnapshot();
		expect(state.context.listingPrice).toEqual(newPrice);
	});

	it('should handle processing state correctly', () => {
		createListingModalStore.send({
			type: 'setListingProcessing',
			processing: true,
		});

		let state = createListingModalStore.getSnapshot();
		expect(state.context.listingIsBeingProcessed).toBe(true);

		createListingModalStore.send({
			type: 'setListingProcessing',
			processing: false,
		});

		state = createListingModalStore.getSnapshot();
		expect(state.context.listingIsBeingProcessed).toBe(false);
	});

	it('should update steps correctly', () => {
		const newSteps = {
			approval: {
				exist: true,
				isExecuting: false,
				execute: () => Promise.resolve(),
			},
		};

		createListingModalStore.send({
			type: 'updateSteps',
			steps: newSteps,
		});

		const state = createListingModalStore.getSnapshot();
		expect(state.context.steps.approval.exist).toBe(true);
	});

	it('should set approval executing state', () => {
		createListingModalStore.send({
			type: 'setApprovalExecuting',
			executing: true,
		});

		const state = createListingModalStore.getSnapshot();
		expect(state.context.steps.approval.isExecuting).toBe(true);
	});

	it('should set transaction executing state', () => {
		createListingModalStore.send({
			type: 'setTransactionExecuting',
			executing: true,
		});

		const state = createListingModalStore.getSnapshot();
		expect(state.context.steps.transaction.isExecuting).toBe(true);
	});

	it('should set orderbook kind with default value', () => {
		createListingModalStore.send({
			type: 'open',
			collectionAddress: '0x123' as Hex,
			chainId: 1,
			collectibleId: '1',
			// orderbookKind not provided
		});

		const state = createListingModalStore.getSnapshot();
		expect(state.context.orderbookKind).toBe(
			OrderbookKind.sequence_marketplace_v2,
		);
	});
});
