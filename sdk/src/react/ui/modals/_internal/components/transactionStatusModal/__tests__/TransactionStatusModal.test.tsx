import { cleanup, render, screen, waitFor } from '@test';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TransactionType } from '../../../../../../_internal/types';
import type { ShowTransactionStatusModalArgs } from '../index';
import TransactionStatusModal from '../index';
import { transactionStatusModalStore } from '../store';

const mockTransactionArgs: ShowTransactionStatusModalArgs = {
	hash: '0x123',
	collectionAddress: '0x456',
	chainId: 1,
	tokenId: 1n,
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
		transactionStatusModalStore.send({ type: 'close' });
		vi.clearAllMocks();
		vi.mocked(useTransactionStatus).mockReturnValue('PENDING');
	});

	it('should not render when closed', () => {
		render(<TransactionStatusModal />);
		expect(
			screen.queryByTestId('transaction-status-modal'),
		).not.toBeInTheDocument();
	});

	it('should show processing state when transaction is processing', async () => {
		vi.mocked(useTransactionStatus).mockReturnValue('PENDING');
		const { type: transactionType, ...rest } = mockTransactionArgs;
		transactionStatusModalStore.send({
			type: 'open',
			transactionType,
			...rest,
		});
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
		vi.mocked(useTransactionStatus).mockReturnValue('SUCCESS');
		const { type: transactionType, ...rest } = mockTransactionArgs;
		transactionStatusModalStore.send({
			type: 'open',
			transactionType,
			...rest,
		});
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
		vi.mocked(useTransactionStatus).mockReturnValue('FAILED');
		const { type: transactionType, ...rest } = mockTransactionArgs;
		transactionStatusModalStore.send({
			type: 'open',
			transactionType,
			...rest,
		});
		render(<TransactionStatusModal />);

		await waitFor(() => {
			const element = screen.queryByTestId('transaction-status-title');
			expect(element).toHaveTextContent('Your purchase has failed');

			const messageElement = screen.queryByTestId('transaction-status-message');
			expect(messageElement).toHaveTextContent(/Your purchase has failed/);
		});
	});

	it('should show timeout state when transaction times out', async () => {
		vi.mocked(useTransactionStatus).mockReturnValue('TIMEOUT');
		const { type: transactionType, ...rest } = mockTransactionArgs;
		transactionStatusModalStore.send({
			type: 'open',
			transactionType,
			...rest,
		});
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
		vi.mocked(useTransactionStatus).mockImplementation(() => {
			onSuccess({
				hash: mockTransactionArgs.hash,
			});
			return 'SUCCESS';
		});

		const { type: transactionType, ...rest } = mockTransactionArgs;
		transactionStatusModalStore.send({
			type: 'open',
			transactionType,
			...rest,
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
		vi.mocked(useTransactionStatus).mockImplementation(() => {
			onError(error);
			return 'FAILED';
		});

		const { type: transactionType, ...rest } = mockTransactionArgs;
		transactionStatusModalStore.send({
			type: 'open',
			transactionType,
			...rest,
		});
		render(<TransactionStatusModal />);

		await waitFor(() => {
			expect(onError).toHaveBeenCalledWith(error);
		});
	});
});
