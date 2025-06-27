import type { Address } from 'viem';
import { beforeEach, describe, expect, it } from 'vitest';
import type { ShowTransferModalArgs } from '../index';
import { transferModalStore } from '../store';

describe('TransferModal Store', () => {
	beforeEach(() => {
		// Reset store to initial state before each test
		transferModalStore.send({ type: 'close' });
	});

	describe('Initial State', () => {
		it('should have correct initial state', () => {
			const state = transferModalStore.getSnapshot();

			expect(state.context).toMatchSnapshot('initial-store-state');
			expect(state.context.isOpen).toBe(false);
			expect(state.context.view).toBe('enterReceiverAddress');
			expect(state.context.state.receiverAddress).toBe('');
			expect(state.context.state.quantity).toBe('1');
			expect(state.context.state.transferIsBeingProcessed).toBe(false);
			expect(state.context.hash).toBeUndefined();
		});
	});

	describe('Open Action', () => {
		const mockOpenArgs: ShowTransferModalArgs = {
			collectionAddress: '0x742d35Cc6634C0532925a3b8D4C9db96' as Address,
			collectibleId: '123',
			chainId: 1,
			callbacks: {
				onSuccess: () => {},
				onError: () => {},
			},
		};

		it('should open modal with provided arguments', () => {
			transferModalStore.send({ type: 'open', ...mockOpenArgs });

			const state = transferModalStore.getSnapshot();

			expect(state.context.isOpen).toBe(true);
			expect(state.context.state.collectionAddress).toBe(
				mockOpenArgs.collectionAddress,
			);
			expect(state.context.state.collectibleId).toBe(
				mockOpenArgs.collectibleId,
			);
			expect(state.context.state.chainId).toBe(mockOpenArgs.chainId);
			expect(state.context.state.callbacks).toBe(mockOpenArgs.callbacks);
		});

		it('should preserve existing state when opening', () => {
			// Set some state first
			transferModalStore.send({ type: 'setReceiverAddress', address: '0x123' });
			transferModalStore.send({ type: 'setQuantity', quantity: '5' });

			transferModalStore.send({ type: 'open', ...mockOpenArgs });

			const state = transferModalStore.getSnapshot();

			expect(state.context.isOpen).toBe(true);
			expect(state.context.state.receiverAddress).toBe('0x123');
			expect(state.context.state.quantity).toBe('5');
		});

		it('should create snapshot of opened state', () => {
			transferModalStore.send({ type: 'open', ...mockOpenArgs });

			const state = transferModalStore.getSnapshot();
			expect(state.context).toMatchSnapshot('store-after-open');
		});
	});

	describe('Close Action', () => {
		it('should reset to initial state when closed', () => {
			const mockOpenArgs: ShowTransferModalArgs = {
				collectionAddress: '0x742d35Cc6634C0532925a3b8D4C9db96' as Address,
				collectibleId: '123',
				chainId: 1,
			};

			// Open and modify state
			transferModalStore.send({ type: 'open', ...mockOpenArgs });
			transferModalStore.send({ type: 'setReceiverAddress', address: '0x456' });
			transferModalStore.send({ type: 'setQuantity', quantity: '10' });
			transferModalStore.send({
				type: 'setView',
				view: 'followWalletInstructions',
			});

			// Close modal
			transferModalStore.send({ type: 'close' });

			const state = transferModalStore.getSnapshot();

			expect(state.context.isOpen).toBe(false);
			expect(state.context.view).toBe('enterReceiverAddress');
			expect(state.context.state.receiverAddress).toBe('');
			expect(state.context.state.quantity).toBe('1');
			expect(state.context.state.transferIsBeingProcessed).toBe(false);
		});
	});

	describe('SetView Action', () => {
		it('should update view state', () => {
			transferModalStore.send({
				type: 'setView',
				view: 'followWalletInstructions',
			});

			const state = transferModalStore.getSnapshot();
			expect(state.context.view).toBe('followWalletInstructions');
		});

		it('should handle undefined view', () => {
			transferModalStore.send({ type: 'setView', view: undefined });

			const state = transferModalStore.getSnapshot();
			expect(state.context.view).toBeUndefined();
		});
	});

	describe('SetHash Action', () => {
		it('should set transaction hash', () => {
			const hash = '0xabcdef123456789' as `0x${string}`;
			transferModalStore.send({ type: 'setHash', hash });

			const state = transferModalStore.getSnapshot();
			expect(state.context.hash).toBe(hash);
		});

		it('should handle undefined hash', () => {
			transferModalStore.send({ type: 'setHash', hash: undefined });

			const state = transferModalStore.getSnapshot();
			expect(state.context.hash).toBeUndefined();
		});
	});

	describe('SetReceiverAddress Action', () => {
		it('should update receiver address', () => {
			const address = '0x742d35Cc6634C0532925a3b8D4C9db96';
			transferModalStore.send({ type: 'setReceiverAddress', address });

			const state = transferModalStore.getSnapshot();
			expect(state.context.state.receiverAddress).toBe(address);
		});

		it('should handle empty address', () => {
			transferModalStore.send({ type: 'setReceiverAddress', address: '' });

			const state = transferModalStore.getSnapshot();
			expect(state.context.state.receiverAddress).toBe('');
		});
	});

	describe('SetQuantity Action', () => {
		it('should update quantity', () => {
			transferModalStore.send({ type: 'setQuantity', quantity: '5' });

			const state = transferModalStore.getSnapshot();
			expect(state.context.state.quantity).toBe('5');
		});

		it('should handle zero quantity', () => {
			transferModalStore.send({ type: 'setQuantity', quantity: '0' });

			const state = transferModalStore.getSnapshot();
			expect(state.context.state.quantity).toBe('0');
		});

		it('should handle string quantity', () => {
			transferModalStore.send({ type: 'setQuantity', quantity: '100' });

			const state = transferModalStore.getSnapshot();
			expect(state.context.state.quantity).toBe('100');
		});
	});

	describe('SetTransferIsBeingProcessed Action', () => {
		it('should set processing state to true', () => {
			transferModalStore.send({
				type: 'setTransferIsBeingProcessed',
				isProcessing: true,
			});

			const state = transferModalStore.getSnapshot();
			expect(state.context.state.transferIsBeingProcessed).toBe(true);
		});

		it('should set processing state to false', () => {
			// First set to true
			transferModalStore.send({
				type: 'setTransferIsBeingProcessed',
				isProcessing: true,
			});

			// Then set to false
			transferModalStore.send({
				type: 'setTransferIsBeingProcessed',
				isProcessing: false,
			});

			const state = transferModalStore.getSnapshot();
			expect(state.context.state.transferIsBeingProcessed).toBe(false);
		});

		it('should create snapshot of processing state', () => {
			transferModalStore.send({
				type: 'setTransferIsBeingProcessed',
				isProcessing: true,
			});

			const state = transferModalStore.getSnapshot();
			expect(state.context).toMatchSnapshot('store-processing-transfer');
		});
	});

	describe('UpdateState Action', () => {
		it('should partially update state', () => {
			const partialUpdate = {
				receiverAddress: '0x123',
				quantity: '10',
				chainId: 137,
			};

			transferModalStore.send({ type: 'updateState', ...partialUpdate });

			const state = transferModalStore.getSnapshot();
			expect(state.context.state.receiverAddress).toBe('0x123');
			expect(state.context.state.quantity).toBe('10');
			expect(state.context.state.chainId).toBe(137);
			// Other fields should remain unchanged
			expect(state.context.state.transferIsBeingProcessed).toBe(false);
		});

		it('should handle callbacks update', () => {
			const callbacks = {
				onSuccess: () => console.log('success'),
				onError: () => console.log('error'),
			};

			transferModalStore.send({ type: 'updateState', callbacks });

			const state = transferModalStore.getSnapshot();
			expect(state.context.state.callbacks).toBe(callbacks);
		});

		it('should merge with existing state', () => {
			// Set initial state
			transferModalStore.send({ type: 'setReceiverAddress', address: '0x456' });
			transferModalStore.send({ type: 'setQuantity', quantity: '5' });

			// Partial update
			transferModalStore.send({ type: 'updateState', chainId: 1 });

			const state = transferModalStore.getSnapshot();
			expect(state.context.state.receiverAddress).toBe('0x456');
			expect(state.context.state.quantity).toBe('5');
			expect(state.context.state.chainId).toBe(1);
		});
	});

	describe('Selector Hooks Integration', () => {
		it('should work with useIsOpen selector', () => {
			// This test verifies the store works with the selector hooks
			// The actual hook testing will be done in component tests

			const initialState = transferModalStore.getSnapshot();
			expect(initialState.context.isOpen).toBe(false);

			transferModalStore.send({
				type: 'open',
				collectionAddress: '0x123' as Address,
				collectibleId: '1',
				chainId: 1,
			});

			const openState = transferModalStore.getSnapshot();
			expect(openState.context.isOpen).toBe(true);
		});

		it('should work with useModalState selector', () => {
			const address = '0x742d35Cc6634C0532925a3b8D4C9db96';
			transferModalStore.send({ type: 'setReceiverAddress', address });

			const state = transferModalStore.getSnapshot();
			expect(state.context.state.receiverAddress).toBe(address);
		});

		it('should work with useView selector', () => {
			transferModalStore.send({
				type: 'setView',
				view: 'followWalletInstructions',
			});

			const state = transferModalStore.getSnapshot();
			expect(state.context.view).toBe('followWalletInstructions');
		});

		it('should work with useHash selector', () => {
			const hash = '0xabcdef' as `0x${string}`;
			transferModalStore.send({ type: 'setHash', hash });

			const state = transferModalStore.getSnapshot();
			expect(state.context.hash).toBe(hash);
		});
	});

	describe('Complex State Transitions', () => {
		it('should handle complete transfer flow state changes', () => {
			const mockArgs: ShowTransferModalArgs = {
				collectionAddress: '0x742d35Cc6634C0532925a3b8D4C9db96' as Address,
				collectibleId: '123',
				chainId: 1,
			};

			// 1. Open modal
			transferModalStore.send({ type: 'open', ...mockArgs });
			expect(transferModalStore.getSnapshot().context.isOpen).toBe(true);

			// 2. Set receiver address
			transferModalStore.send({ type: 'setReceiverAddress', address: '0x456' });
			expect(
				transferModalStore.getSnapshot().context.state.receiverAddress,
			).toBe('0x456');

			// 3. Set quantity for ERC1155
			transferModalStore.send({ type: 'setQuantity', quantity: '5' });
			expect(transferModalStore.getSnapshot().context.state.quantity).toBe('5');

			// 4. Start processing
			transferModalStore.send({
				type: 'setTransferIsBeingProcessed',
				isProcessing: true,
			});
			expect(
				transferModalStore.getSnapshot().context.state.transferIsBeingProcessed,
			).toBe(true);

			// 5. Switch to wallet instructions view
			transferModalStore.send({
				type: 'setView',
				view: 'followWalletInstructions',
			});
			expect(transferModalStore.getSnapshot().context.view).toBe(
				'followWalletInstructions',
			);

			// 6. Set transaction hash
			const hash = '0xabcdef123456789' as `0x${string}`;
			transferModalStore.send({ type: 'setHash', hash });
			expect(transferModalStore.getSnapshot().context.hash).toBe(hash);

			// 7. Complete transfer (close modal)
			transferModalStore.send({ type: 'close' });
			const finalState = transferModalStore.getSnapshot();
			expect(finalState.context.isOpen).toBe(false);
			expect(finalState.context.view).toBe('enterReceiverAddress');
			expect(finalState.context.state.transferIsBeingProcessed).toBe(false);
		});

		it('should create snapshot of complex state', () => {
			const mockArgs: ShowTransferModalArgs = {
				collectionAddress: '0x742d35Cc6634C0532925a3b8D4C9db96' as Address,
				collectibleId: '123',
				chainId: 1,
				callbacks: {
					onSuccess: () => {},
					onError: () => {},
				},
			};

			transferModalStore.send({ type: 'open', ...mockArgs });
			transferModalStore.send({ type: 'setReceiverAddress', address: '0x456' });
			transferModalStore.send({ type: 'setQuantity', quantity: '10' });
			transferModalStore.send({
				type: 'setTransferIsBeingProcessed',
				isProcessing: true,
			});

			const state = transferModalStore.getSnapshot();
			expect(state.context).toMatchSnapshot('store-complex-state');
		});
	});
});
