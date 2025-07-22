import type { Hex } from 'viem';
import { describe, expect, it, vi } from 'vitest';
import type { FeeOption } from '../../../../../types/waas-types';
import type { Order } from '../../../../_internal';
import { sellModalStore } from '../store/sellModalStore';

// Mock order for testing
const mockOrder = {
	orderId: '123',
	quantityRemaining: '1',
	pricePerToken: '1000000000000000000', // 1 ETH
	createdBy: '0xuser' as Hex,
	createdAt: new Date().toISOString(),
	isListing: false,
} as unknown as Order;

describe('sellModalStore', () => {
	describe('state transitions', () => {
		it('should open modal with correct initial state', () => {
			const initialSnapshot = sellModalStore.getInitialSnapshot();
			const [nextSnapshot] = sellModalStore.transition(initialSnapshot, {
				type: 'open',
				collectionAddress: '0x123' as Hex,
				chainId: 1,
				tokenId: '1',
				order: mockOrder,
			});

			expect(nextSnapshot.context).toMatchObject({
				isOpen: true,
				status: 'idle',
				collectionAddress: '0x123',
				chainId: 1,
				tokenId: '1',
				order: mockOrder,
			});
		});

		it('should close modal and reset state', () => {
			// Start from open state
			const [openSnapshot] = sellModalStore.transition(
				sellModalStore.getInitialSnapshot(),
				{
					type: 'open',
					collectionAddress: '0x123' as Hex,
					chainId: 1,
					tokenId: '1',
					order: mockOrder,
				},
			);

			const [closedSnapshot] = sellModalStore.transition(openSnapshot, {
				type: 'close',
			});

			expect(closedSnapshot.context).toEqual(
				sellModalStore.getInitialSnapshot().context,
			);
		});

		it('should transition through approval flow', () => {
			// Start from open state
			const [openSnapshot] = sellModalStore.transition(
				sellModalStore.getInitialSnapshot(),
				{
					type: 'open',
					collectionAddress: '0x123' as Hex,
					chainId: 1,
					tokenId: '1',
					order: mockOrder,
				},
			);

			// Check approval
			const [checkingSnapshot] = sellModalStore.transition(openSnapshot, {
				type: 'checkApprovalStart',
			});
			expect(checkingSnapshot.context.status).toBe('checking_approval');

			// Approval required
			const [approvalSnapshot] = sellModalStore.transition(checkingSnapshot, {
				type: 'approvalRequired',
				step: { id: 'tokenApproval' } as any,
			});
			expect(approvalSnapshot.context.status).toBe('awaiting_approval');
			expect(approvalSnapshot.context.approvalRequired).toBe(true);

			// Start approval
			const [approvingSnapshot] = sellModalStore.transition(approvalSnapshot, {
				type: 'startApproval',
			});
			expect(approvingSnapshot.context.status).toBe('approving');

			// Complete approval
			const [readySnapshot] = sellModalStore.transition(approvingSnapshot, {
				type: 'approvalCompleted',
			});
			expect(readySnapshot.context.status).toBe('ready_to_sell');
			expect(readySnapshot.context.approvalRequired).toBe(false);
		});

		it('should handle approval not required flow', () => {
			const [openSnapshot] = sellModalStore.transition(
				sellModalStore.getInitialSnapshot(),
				{
					type: 'open',
					collectionAddress: '0x123' as Hex,
					chainId: 1,
					tokenId: '1',
					order: mockOrder,
				},
			);

			const [checkingSnapshot] = sellModalStore.transition(openSnapshot, {
				type: 'checkApprovalStart',
			});

			const [readySnapshot] = sellModalStore.transition(checkingSnapshot, {
				type: 'approvalNotRequired',
			});

			expect(readySnapshot.context.status).toBe('ready_to_sell');
			expect(readySnapshot.context.approvalRequired).toBe(false);
		});

		it('should handle fee selection flow for WaaS', () => {
			const [readySnapshot] = sellModalStore.transition(
				sellModalStore.getInitialSnapshot(),
				{
					type: 'open',
					collectionAddress: '0x123' as Hex,
					chainId: 1,
					tokenId: '1',
					order: mockOrder,
				},
			);

			// Show fee options
			const [feeSnapshot] = sellModalStore.transition(readySnapshot, {
				type: 'showFeeOptions',
			});
			expect(feeSnapshot.context.status).toBe('selecting_fees');
			expect(feeSnapshot.context.feeOptionsVisible).toBe(true);

			// Select fee option
			const feeOption = {
				gasLimit: 21000,
				to: '0x0000000000000000000000000000000000000000',
				value: '10',
				token: {
					chainId: 1,
					contractAddress: null,
					decimals: 18,
					logoURL: '',
					name: 'Ethereum',
					symbol: 'ETH',
					tokenID: null,
					type: 'native',
				},
			} as FeeOption;
			const [selectedSnapshot] = sellModalStore.transition(feeSnapshot, {
				type: 'selectFeeOption',
				option: feeOption,
			});
			expect(selectedSnapshot.context.selectedFeeOption).toEqual(feeOption);

			// Hide fee options
			const [hiddenSnapshot] = sellModalStore.transition(selectedSnapshot, {
				type: 'hideFeeOptions',
			});
			expect(hiddenSnapshot.context.status).toBe('ready_to_sell');
			expect(hiddenSnapshot.context.feeOptionsVisible).toBe(false);
		});

		it('should handle sell execution flow', () => {
			const [readySnapshot] = sellModalStore.transition(
				sellModalStore.getInitialSnapshot(),
				{
					type: 'open',
					collectionAddress: '0x123' as Hex,
					chainId: 1,
					tokenId: '1',
					order: mockOrder,
				},
			);

			// Start sell
			const [executingSnapshot] = sellModalStore.transition(readySnapshot, {
				type: 'startSell',
			});
			expect(executingSnapshot.context.status).toBe('executing');
			expect(executingSnapshot.context.error).toBeNull();

			// Complete sell
			const [completedSnapshot] = sellModalStore.transition(executingSnapshot, {
				type: 'sellCompleted',
				hash: '0xabc' as Hex,
				orderId: '123',
			});
			expect(completedSnapshot.context.status).toBe('completed');
		});

		it('should handle errors correctly', () => {
			const [snapshot] = sellModalStore.transition(
				sellModalStore.getInitialSnapshot(),
				{
					type: 'open',
					collectionAddress: '0x123' as Hex,
					chainId: 1,
					tokenId: '1',
					order: mockOrder,
				},
			);

			const error = new Error('Transaction failed');

			const [errorSnapshot] = sellModalStore.transition(snapshot, {
				type: 'errorOccurred',
				error,
			});

			expect(errorSnapshot.context.status).toBe('error');
			expect(errorSnapshot.context.error).toBe(error);
		});

		it('should clear errors', () => {
			const errorSnapshot = {
				...sellModalStore.getInitialSnapshot(),
				context: {
					...sellModalStore.getInitialSnapshot().context,
					status: 'error' as const,
					error: new Error('Some error'),
				},
			};

			const [clearedSnapshot] = sellModalStore.transition(errorSnapshot, {
				type: 'clearError',
			});

			expect(clearedSnapshot.context.error).toBeNull();
			expect(clearedSnapshot.context.status).toBe('idle');
		});
	});

	describe('effects', () => {
		it('should emit events on modal open', () => {
			const [_, effects] = sellModalStore.transition(
				sellModalStore.getInitialSnapshot(),
				{
					type: 'open',
					collectionAddress: '0x123' as Hex,
					chainId: 1,
					tokenId: '1',
					order: mockOrder,
				},
			);

			const emittedEvents = effects.filter(
				(e) => 'type' in e && e.type === 'modalOpened',
			);
			expect(emittedEvents).toHaveLength(1);
			expect(emittedEvents[0]).toMatchObject({
				type: 'modalOpened',
				orderId: '123',
			});
		});

		it('should emit events on successful completion', () => {
			const [snapshot] = sellModalStore.transition(
				sellModalStore.getInitialSnapshot(),
				{
					type: 'open',
					collectionAddress: '0x123' as Hex,
					chainId: 1,
					tokenId: '1',
					order: mockOrder,
				},
			);

			const [_, effects] = sellModalStore.transition(snapshot, {
				type: 'sellCompleted',
				hash: '0xabc' as Hex,
				orderId: '123',
			});

			const emittedEvents = effects.filter(
				(e) => 'type' in e && e.type === 'transactionCompleted',
			);
			expect(emittedEvents).toHaveLength(1);
			expect(emittedEvents[0]).toMatchObject({
				type: 'transactionCompleted',
				hash: '0xabc',
				orderId: '123',
			});
		});

		it('should call callbacks through effects', () => {
			const onSuccess = vi.fn();
			const snapshot = {
				...sellModalStore.getInitialSnapshot(),
				context: {
					...sellModalStore.getInitialSnapshot().context,
					onSuccess,
					isOpen: true,
					order: mockOrder,
				},
			};

			const [_, effects] = sellModalStore.transition(snapshot, {
				type: 'sellCompleted',
				hash: '0xabc' as Hex,
				orderId: '123',
			});

			// Execute function effects
			effects.forEach((effect) => {
				if (typeof effect === 'function') {
					effect();
				}
			});

			expect(onSuccess).toHaveBeenCalledWith({
				hash: '0xabc',
				orderId: '123',
			});
		});

		it('should call error callback on error', () => {
			const onError = vi.fn();
			const snapshot = {
				...sellModalStore.getInitialSnapshot(),
				context: {
					...sellModalStore.getInitialSnapshot().context,
					onError,
					isOpen: true,
				},
			};

			const error = new Error('Transaction failed');
			const [_, effects] = sellModalStore.transition(snapshot, {
				type: 'errorOccurred',
				error,
			});

			// Execute function effects
			effects.forEach((effect) => {
				if (typeof effect === 'function') {
					effect();
				}
			});

			expect(onError).toHaveBeenCalledWith(error);
		});

		it('should emit transaction started event', () => {
			const [snapshot] = sellModalStore.transition(
				sellModalStore.getInitialSnapshot(),
				{
					type: 'open',
					collectionAddress: '0x123' as Hex,
					chainId: 1,
					tokenId: '1',
					order: mockOrder,
				},
			);

			const [_, effects] = sellModalStore.transition(snapshot, {
				type: 'startSell',
			});

			const emittedEvents = effects.filter(
				(e) => 'type' in e && e.type === 'transactionStarted',
			);
			expect(emittedEvents).toHaveLength(1);
			expect(emittedEvents[0]).toMatchObject({
				type: 'transactionStarted',
				orderId: '123',
			});
		});

		it('should emit approval started event', () => {
			const [snapshot] = sellModalStore.transition(
				sellModalStore.getInitialSnapshot(),
				{
					type: 'open',
					collectionAddress: '0x123' as Hex,
					chainId: 1,
					tokenId: '1',
					order: mockOrder,
				},
			);

			const [_, effects] = sellModalStore.transition(snapshot, {
				type: 'startApproval',
			});

			const emittedEvents = effects.filter(
				(e) => 'type' in e && e.type === 'approvalStarted',
			);
			expect(emittedEvents).toHaveLength(1);
			expect(emittedEvents[0]).toMatchObject({
				type: 'approvalStarted',
				tokenAddress: expect.any(String),
			});
		});
	});
});
