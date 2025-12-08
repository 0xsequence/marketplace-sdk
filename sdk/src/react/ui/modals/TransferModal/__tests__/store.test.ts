import type { Address } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ShowTransferModalArgs } from '../store';
import { transferModalStore } from '../store';

describe('TransferModal store', () => {
	beforeEach(() => {
		transferModalStore.send({ type: 'close' });
	});

	it('initializes with sensible defaults', () => {
		const { context } = transferModalStore.getSnapshot();
		expect(context.isOpen).toBe(false);
		expect(context.receiverInput).toBe('');
		expect(context.quantityInput).toBe('1');
		expect(context.isReceiverTouched).toBe(false);
		expect(context.isQuantityTouched).toBe(false);
		expect(context.callbacks).toBeUndefined();
	});

	it('opens with provided arguments and resets form state', () => {
		const openArgs: ShowTransferModalArgs = {
			collectionAddress: '0x742d35Cc6634C0532925a3b8D4C9db96' as Address,
			tokenId: 123n,
			chainId: 1,
			callbacks: { onSuccess: vi.fn(), onError: vi.fn() },
		};

		transferModalStore.send({ type: 'updateReceiver', value: '0xabc' });
		transferModalStore.send({ type: 'updateQuantity', value: '5' });
		transferModalStore.send({ type: 'open', ...openArgs });

		const { context } = transferModalStore.getSnapshot();
		expect(context.isOpen).toBe(true);
		expect(context.collectionAddress).toBe(openArgs.collectionAddress);
		expect(context.tokenId).toBe(openArgs.tokenId);
		expect(context.chainId).toBe(openArgs.chainId);
		expect(context.receiverInput).toBe('');
		expect(context.quantityInput).toBe('1');
		expect(context.isReceiverTouched).toBe(false);
		expect(context.isQuantityTouched).toBe(false);
		expect(context.callbacks).toEqual(openArgs.callbacks);
	});

	it('updates receiver and quantity inputs independently', () => {
		transferModalStore.send({ type: 'updateReceiver', value: '0xabc' });
		transferModalStore.send({ type: 'touchReceiver' });
		transferModalStore.send({ type: 'updateQuantity', value: '3' });

		const { context } = transferModalStore.getSnapshot();
		expect(context.receiverInput).toBe('0xabc');
		expect(context.isReceiverTouched).toBe(true);
		expect(context.quantityInput).toBe('3');
		expect(context.isQuantityTouched).toBe(true);
	});

	it('resets to initial state on close', () => {
		transferModalStore.send({
			type: 'open',
			collectionAddress: '0x742d35Cc6634C0532925a3b8D4C9db96' as Address,
			tokenId: 123n,
			chainId: 1,
		});

		transferModalStore.send({ type: 'close' });
		const { context } = transferModalStore.getSnapshot();
		expect(context).toMatchObject({
			isOpen: false,
			receiverInput: '',
			quantityInput: '1',
			isReceiverTouched: false,
			isQuantityTouched: false,
		});
	});
});
