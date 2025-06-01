import { cleanup, render, screen, waitFor } from '@test';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TransactionType } from '../../../../../../_internal/types';
import TransactionStatusModal from '../index';
import type { ShowTransactionStatusModalArgs } from '../index';
import { close, open, transactionStatusModal$ } from '../store';

const mockTransactionArgs: ShowTransactionStatusModalArgs = {
	hash: '0x123' as `0x${string}`,
	collectionAddress: '0x456' as `0x${string}`,
	chainId: 1,
	collectibleId: '1',
	type: TransactionType.BUY,
};

vi.mock('../hooks/useTransactionStatus', () => ({
	default: vi.fn(),
}));

vi.mock('../../../../../hooks', () => ({
	useCollectible: vi.fn(() => ({
		data: {
			name: 'Test Collectible',
			decimals: 0,
		},
		isLoading: false,
		isError: false,
	})),
}));

import useTransactionStatus from '../hooks/useTransactionStatus';

describe('TransactionStatusModal', () => {
	afterEach(() => {
		cleanup();
	});

	beforeEach(() => {
		close();
		vi.clearAllMocks();
		vi.mocked(useTransactionStatus).mockReturnValue('PENDING');
	});

	it('should not render when closed', () => {
		render(<TransactionStatusModal />);
		expect(
			screen.queryByTestId('transaction-status-modal'),
		).not.toBeInTheDocument();
	});

	it('should update store state when open is called', () => {
		expect(transactionStatusModal$.getSnapshot().context.isOpen).toBe(false);
		open(mockTransactionArgs);
		expect(transactionStatusModal$.getSnapshot().context.isOpen).toBe(true);
	});

	it('should show processing state when transaction is processing', async () => {
		vi.mocked(useTransactionStatus).mockReturnValue('PENDING');

		const { rerender } = render(<TransactionStatusModal />);

		// Open the modal
		open(mockTransactionArgs);

		// Force a re-render to pick up store changes
		rerender(<TransactionStatusModal />);

		await waitFor(() => {
			expect(screen.getByText('Processing transaction')).toBeInTheDocument();
		});
	});

	it('should show success state when transaction is successful', async () => {
		vi.mocked(useTransactionStatus).mockReturnValue('SUCCESS');

		const { rerender } = render(<TransactionStatusModal />);
		open(mockTransactionArgs);
		rerender(<TransactionStatusModal />);

		await waitFor(() => {
			expect(
				screen.getByText(
					/You just purchased.*been confirmed on the blockchain!/,
				),
			).toBeInTheDocument();
		});
	});

	it('should show failed state when transaction fails', async () => {
		vi.mocked(useTransactionStatus).mockReturnValue('FAILED');

		const { rerender } = render(<TransactionStatusModal />);
		open(mockTransactionArgs);
		rerender(<TransactionStatusModal />);

		await waitFor(() => {
			expect(screen.getByText('Transaction failed')).toBeInTheDocument();
		});
	});

	it('should show timeout state when transaction times out', async () => {
		vi.mocked(useTransactionStatus).mockReturnValue('TIMEOUT');

		const { rerender } = render(<TransactionStatusModal />);
		open(mockTransactionArgs);
		rerender(<TransactionStatusModal />);

		await waitFor(() => {
			expect(
				screen.getByText(
					/Your purchase takes too long.*track it on the explorer/,
				),
			).toBeInTheDocument();
		});
	});

	it('should call onSuccess callback when transaction succeeds', async () => {
		const onSuccess = vi.fn();
		vi.mocked(useTransactionStatus).mockImplementation(() => {
			onSuccess({
				hash: mockTransactionArgs.hash,
			});
			return 'SUCCESS';
		});

		render(<TransactionStatusModal />);
		open({
			...mockTransactionArgs,
			callbacks: { onSuccess },
		});

		await waitFor(() => {
			expect(onSuccess).toHaveBeenCalledWith({
				hash: mockTransactionArgs.hash,
			});
		});
	});

	it('should call onError callback when transaction fails', async () => {
		const onError = vi.fn();
		const error = new Error('Transaction failed');
		vi.mocked(useTransactionStatus).mockImplementation(() => {
			onError(error);
			return 'FAILED';
		});

		open({
			...mockTransactionArgs,
			callbacks: { onError },
		});
		render(<TransactionStatusModal />);

		await waitFor(() => {
			expect(onError).toHaveBeenCalledWith(error);
		});
	});
});
