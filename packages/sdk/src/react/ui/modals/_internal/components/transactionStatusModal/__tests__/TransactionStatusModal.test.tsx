import {
	render,
	cleanup,
	screen,
	waitFor,
} from '../../../../../../_internal/test-utils';
import '@testing-library/jest-dom/vitest';
import TransactionStatusModal from '../index';
import { transactionStatusModal$ } from '../store';
import type { ShowTransactionStatusModalArgs } from '../index';
import { TransactionType } from '../../../../../../_internal/types';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';

const mockTransactionArgs: ShowTransactionStatusModalArgs = {
	hash: '0x123' as `0x${string}`,
	collectionAddress: '0x456' as `0x${string}`,
	chainId: '1',
	collectibleId: '1',
	type: TransactionType.BUY,
};

vi.mock('../hooks/useTransactionStatus', () => ({
	default: vi.fn(),
}));

import useTransactionStatus from '../hooks/useTransactionStatus';

describe('TransactionStatusModal', () => {
	afterEach(() => {
		cleanup();
	});

	beforeEach(() => {
		transactionStatusModal$.close();
		vi.clearAllMocks();
		(useTransactionStatus as any).mockReturnValue('PENDING');
	});

	it('should not render when closed', () => {
		render(<TransactionStatusModal />);
		expect(
			screen.queryByTestId('transaction-status-modal'),
		).not.toBeInTheDocument();
	});

	it('should show processing state when transaction is processing', async () => {
		(useTransactionStatus as any).mockReturnValue('PENDING');
		transactionStatusModal$.open(mockTransactionArgs);
		render(<TransactionStatusModal />);

		await waitFor(() => {
			const element = screen.queryByTestId('transaction-status-title');
			expect(element).toHaveTextContent('Your purchase is processing');

			const messageElement = screen.queryByTestId('transaction-status-message');
			expect(messageElement).toHaveTextContent(
				/It should be confirmed on the blockchain shortly/,
			);
		});
	});

	it('should show success state when transaction is successful', async () => {
		(useTransactionStatus as any).mockReturnValue('SUCCESS');
		transactionStatusModal$.open(mockTransactionArgs);
		render(<TransactionStatusModal />);

		await waitFor(() => {
			const element = screen.queryByTestId('transaction-status-title');
			expect(element).toHaveTextContent('Your purchase has processed');

			const messageElement = screen.queryByTestId('transaction-status-message');
			expect(messageElement).toHaveTextContent(
				/You just purchased .* It's been confirmed on the blockchain!/,
			);
		});
	});

	it('should show failed state when transaction fails', async () => {
		(useTransactionStatus as any).mockReturnValue('FAILED');
		transactionStatusModal$.open(mockTransactionArgs);
		render(<TransactionStatusModal />);

		await waitFor(() => {
			const element = screen.queryByTestId('transaction-status-title');
			expect(element).toHaveTextContent('Your purchase has failed');

			const messageElement = screen.queryByTestId('transaction-status-message');
			expect(messageElement).toHaveTextContent(/Your purchase has failed/);
		});
	});

	it('should show timeout state when transaction times out', async () => {
		(useTransactionStatus as any).mockReturnValue('TIMEOUT');
		transactionStatusModal$.open(mockTransactionArgs);
		render(<TransactionStatusModal />);

		await waitFor(() => {
			const element = screen.queryByTestId('transaction-status-title');
			expect(element).toHaveTextContent('Your purchase takes too long');

			const messageElement = screen.queryByTestId('transaction-status-message');
			expect(messageElement).toHaveTextContent(/Your purchase takes too long/);
		});
	});

	it('should call onSuccess callback when transaction succeeds', async () => {
		const onSuccess = vi.fn();
		(useTransactionStatus as any).mockImplementation(() => {
			onSuccess({
				hash: mockTransactionArgs.hash,
			});
			return 'SUCCESS';
		});

		transactionStatusModal$.open({
			...mockTransactionArgs,
			callbacks: { onSuccess },
		});
		render(<TransactionStatusModal />);

		await waitFor(() => {
			expect(onSuccess).toHaveBeenCalledWith({
				hash: mockTransactionArgs.hash,
			});
		});
	});

	it('should call onError callback when transaction fails', async () => {
		const onError = vi.fn();
		const error = new Error('Transaction failed');
		(useTransactionStatus as any).mockImplementation(() => {
			onError(error);
			return 'FAILED';
		});

		transactionStatusModal$.open({
			...mockTransactionArgs,
			callbacks: { onError },
		});
		render(<TransactionStatusModal />);

		await waitFor(() => {
			expect(onError).toHaveBeenCalledWith(error);
		});
	});
});
