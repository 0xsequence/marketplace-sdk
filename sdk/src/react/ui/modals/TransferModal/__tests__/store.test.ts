import type { Address } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ShowTransferModalArgs } from '../index';
import { transferModalStore } from '../store';

describe('TransferModal Store', () => {
	beforeEach(() => {
		transferModalStore.send({ type: 'close' });
	});

	describe('Initial State', () => {
		it('should have correct initial state', () => {
			const state = transferModalStore.getSnapshot();

			expect(state.context).toMatchSnapshot('initial-store-state');
			expect(state.context.isOpen).toBe(false);
			expect(state.context.view).toBe('enterReceiverAddress');
			expect(state.context.receiverAddress).toBe('');
			expect(state.context.quantity).toBe('1');
			expect(state.context.transferIsProcessing).toBe(false);
			expect(state.context.hash).toBeUndefined();
			expect(state.context.onSuccess).toBeUndefined();
			expect(state.context.onError).toBeUndefined();
		});
	});

	describe('Open Action', () => {
		const mockOpenArgs: ShowTransferModalArgs = {
			collectionAddress: '0x742d35Cc6634C0532925a3b8D4C9db96' as Address,
			tokenId: 123n,
			chainId: 1,
		};

		it('should open modal with provided arguments', () => {
			transferModalStore.send({ type: 'open', ...mockOpenArgs });

			const state = transferModalStore.getSnapshot();

			expect(state.context.isOpen).toBe(true);
			expect(state.context.collectionAddress).toBe(
				mockOpenArgs.collectionAddress,
			);
			expect(state.context.tokenId).toBe(mockOpenArgs.tokenId);
			expect(state.context.chainId).toBe(mockOpenArgs.chainId);
		});

		it('should store callbacks when provided', () => {
			const onSuccess = vi.fn();
			const onError = vi.fn();

			transferModalStore.send({
				type: 'open',
				...mockOpenArgs,
				callbacks: { onSuccess, onError },
			});

			const state = transferModalStore.getSnapshot();

			expect(state.context.onSuccess).toBe(onSuccess);
			expect(state.context.onError).toBe(onError);
		});

		it('should reset other fields when opening', () => {
			// First set some values
			transferModalStore.send({
				type: 'updateTransferDetails',
				receiverAddress: '0x123',
				quantity: '5',
			});

			// Then open modal
			transferModalStore.send({ type: 'open', ...mockOpenArgs });

			const state = transferModalStore.getSnapshot();

			expect(state.context.receiverAddress).toBe('');
			expect(state.context.quantity).toBe('1');
			expect(state.context.hash).toBeUndefined();
		});
	});

	describe('Close Action', () => {
		it('should reset all state when closing', () => {
			const mockOpenArgs: ShowTransferModalArgs = {
				collectionAddress: '0x742d35Cc6634C0532925a3b8D4C9db96' as Address,
				tokenId: 123n,
				chainId: 1,
			};

			// Open modal and set some values
			transferModalStore.send({ type: 'open', ...mockOpenArgs });
			transferModalStore.send({
				type: 'updateTransferDetails',
				receiverAddress: '0x123',
				quantity: '5',
			});
			transferModalStore.send({ type: 'startTransfer' });

			// Close modal
			transferModalStore.send({ type: 'close' });

			const state = transferModalStore.getSnapshot();

			expect(state.context.isOpen).toBe(false);
			expect(state.context.receiverAddress).toBe('');
			expect(state.context.quantity).toBe('1');
			expect(state.context.transferIsProcessing).toBe(false);
			expect(state.context.view).toBe('enterReceiverAddress');
			expect(state.context.onSuccess).toBeUndefined();
			expect(state.context.onError).toBeUndefined();
		});
	});

	describe('Update Transfer Details Action', () => {
		it('should update receiver address', () => {
			const newAddress = '0x742d35Cc6634C0532925a3b844e3b142717bCE8';

			transferModalStore.send({
				type: 'updateTransferDetails',
				receiverAddress: newAddress,
			});

			const state = transferModalStore.getSnapshot();
			expect(state.context.receiverAddress).toBe(newAddress);
		});

		it('should update quantity', () => {
			transferModalStore.send({
				type: 'updateTransferDetails',
				quantity: '10',
			});

			const state = transferModalStore.getSnapshot();
			expect(state.context.quantity).toBe('10');
		});

		it('should update both receiver address and quantity', () => {
			const newAddress = '0x742d35Cc6634C0532925a3b844e3b142717bCE8';

			transferModalStore.send({
				type: 'updateTransferDetails',
				receiverAddress: newAddress,
				quantity: '5',
			});

			const state = transferModalStore.getSnapshot();
			expect(state.context.receiverAddress).toBe(newAddress);
			expect(state.context.quantity).toBe('5');
		});

		it('should only update provided fields', () => {
			// Set initial values
			transferModalStore.send({
				type: 'updateTransferDetails',
				receiverAddress: '0x123',
				quantity: '5',
			});

			// Update only quantity
			transferModalStore.send({
				type: 'updateTransferDetails',
				quantity: '10',
			});

			const state = transferModalStore.getSnapshot();
			expect(state.context.receiverAddress).toBe('0x123');
			expect(state.context.quantity).toBe('10');
		});
	});

	describe('Start Transfer Action', () => {
		it('should set processing state and change view', () => {
			transferModalStore.send({ type: 'startTransfer' });

			const state = transferModalStore.getSnapshot();
			expect(state.context.transferIsProcessing).toBe(true);
			expect(state.context.view).toBe('followWalletInstructions');
		});
	});

	describe('Complete Transfer Action', () => {
		it('should set hash and stop processing', () => {
			const hash = '0x123abc' as Address;

			transferModalStore.send({ type: 'startTransfer' });
			transferModalStore.send({ type: 'completeTransfer', hash });

			const state = transferModalStore.getSnapshot();
			expect(state.context.hash).toBe(hash);
			expect(state.context.transferIsProcessing).toBe(false);
		});

		it('should call onSuccess callback when provided', () => {
			const hash = '0x123abc' as Address;
			const onSuccess = vi.fn();

			// Open modal with callback
			transferModalStore.send({
				type: 'open',
				collectionAddress: '0x742d35Cc6634C0532925a3b8D4C9db96' as Address,
				tokenId: 123n,
				chainId: 1,
				callbacks: { onSuccess },
			});

			transferModalStore.send({ type: 'completeTransfer', hash });

			expect(onSuccess).toHaveBeenCalledWith({ hash });
		});

		it('should handle missing callback gracefully', () => {
			const hash = '0x123abc' as Address;

			transferModalStore.send({
				type: 'open',
				collectionAddress: '0x742d35Cc6634C0532925a3b8D4C9db96' as Address,
				tokenId: 123n,
				chainId: 1,
			});

			expect(() => {
				transferModalStore.send({ type: 'completeTransfer', hash });
			}).not.toThrow();
		});
	});

	describe('Fail Transfer Action', () => {
		it('should stop processing and reset view', () => {
			const error = new Error('Transfer failed');

			transferModalStore.send({ type: 'startTransfer' });
			transferModalStore.send({ type: 'failTransfer', error });

			const state = transferModalStore.getSnapshot();
			expect(state.context.transferIsProcessing).toBe(false);
			expect(state.context.view).toBe('enterReceiverAddress');
		});

		it('should call onError callback when provided', () => {
			const error = new Error('Transfer failed');
			const onError = vi.fn();

			// Open modal with callback
			transferModalStore.send({
				type: 'open',
				collectionAddress: '0x742d35Cc6634C0532925a3b8D4C9db96' as Address,
				tokenId: 123n,
				chainId: 1,
				callbacks: { onError },
			});

			transferModalStore.send({ type: 'failTransfer', error });

			expect(onError).toHaveBeenCalledWith(error);
		});

		it('should handle missing callback gracefully', () => {
			const error = new Error('Transfer failed');

			// Open modal without callbacks
			transferModalStore.send({
				type: 'open',
				collectionAddress: '0x742d35Cc6634C0532925a3b8D4C9db96' as Address,
				tokenId: 123n,
				chainId: 1,
			});

			// Should not throw
			expect(() => {
				transferModalStore.send({ type: 'failTransfer', error });
			}).not.toThrow();
		});
	});

	describe('Integration Flow', () => {
		it('should handle complete transfer flow', () => {
			const mockArgs: ShowTransferModalArgs = {
				collectionAddress: '0x742d35Cc6634C0532925a3b8D4C9db96' as Address,
				tokenId: 123n,
				chainId: 1,
			};

			// 1. Open modal
			transferModalStore.send({ type: 'open', ...mockArgs });

			// 2. Enter receiver address
			transferModalStore.send({
				type: 'updateTransferDetails',
				receiverAddress: '0xabc',
			});

			// 3. Update quantity (for ERC1155)
			transferModalStore.send({
				type: 'updateTransferDetails',
				quantity: '3',
			});

			// 4. Start transfer
			transferModalStore.send({ type: 'startTransfer' });

			let state = transferModalStore.getSnapshot();
			expect(state.context.transferIsProcessing).toBe(true);
			expect(state.context.view).toBe('followWalletInstructions');

			// 5. Complete transfer
			const hash = '0x123abc' as Address;
			transferModalStore.send({ type: 'completeTransfer', hash });

			state = transferModalStore.getSnapshot();
			expect(state.context.hash).toBe(hash);
			expect(state.context.transferIsProcessing).toBe(false);

			// 6. Close modal
			transferModalStore.send({ type: 'close' });

			state = transferModalStore.getSnapshot();
			expect(state.context.isOpen).toBe(false);
		});

		it('should handle transfer failure flow', () => {
			const mockArgs: ShowTransferModalArgs = {
				collectionAddress: '0x742d35Cc6634C0532925a3b8D4C9db96' as Address,
				tokenId: 123n,
				chainId: 1,
			};

			transferModalStore.send({ type: 'open', ...mockArgs });

			transferModalStore.send({
				type: 'updateTransferDetails',
				receiverAddress: '0xabc',
				quantity: '1',
			});

			transferModalStore.send({ type: 'startTransfer' });

			const error = new Error('User rejected transaction');
			transferModalStore.send({ type: 'failTransfer', error });

			const state = transferModalStore.getSnapshot();
			expect(state.context.transferIsProcessing).toBe(false);
			expect(state.context.view).toBe('enterReceiverAddress');
			expect(state.context.hash).toBeUndefined();
		});

		it('should handle complete flow with callbacks', () => {
			const onSuccess = vi.fn();
			const onError = vi.fn();
			const hash = '0x123abc' as Address;

			const mockArgs: ShowTransferModalArgs = {
				collectionAddress: '0x742d35Cc6634C0532925a3b8D4C9db96' as Address,
				tokenId: 123n,
				chainId: 1,
				callbacks: { onSuccess, onError },
			};

			transferModalStore.send({ type: 'open', ...mockArgs });

			transferModalStore.send({ type: 'completeTransfer', hash });

			expect(onSuccess).toHaveBeenCalledWith({ hash });
			expect(onError).not.toHaveBeenCalled();
		});
	});
});
