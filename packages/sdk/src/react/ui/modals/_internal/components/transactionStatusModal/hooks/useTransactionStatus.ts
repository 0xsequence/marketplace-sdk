import { skipToken, useQuery } from '@tanstack/react-query';
import { useWallet } from '../../../../../../_internal/wallet/useWallet';
import type { TransactionStatus } from '../store';
import { TransactionStatus as IndexerTransactionStatus } from '@0xsequence/indexer';
import { type Hex, WaitForTransactionReceiptTimeoutError } from 'viem';
import type { ModalCallbacks } from '../../../types';
import { useState, useEffect } from 'react';

const useTransactionStatus = (
	hash: Hex | undefined,
	chainId: string,
	callbacks?: ModalCallbacks,
) => {
	const { wallet } = useWallet();
	const [status, setStatus] = useState<TransactionStatus>(
		hash ? 'PENDING' : 'SUCCESS',
	);

	const { data: confirmationResult } = useQuery({
		queryKey: ['transaction-confirmation', hash, chainId, !!wallet],
		queryFn:
			!!wallet && hash
				? async () =>
						await wallet.handleConfirmTransactionStep(hash, Number(chainId))
				: skipToken,
	});

	useEffect(() => {
		if (!hash) {
			setStatus('SUCCESS');
			return;
		}

		if (!confirmationResult) {
			setStatus('PENDING');
			return;
		}

		try {
			if (
				confirmationResult.txnStatus === IndexerTransactionStatus.SUCCESSFUL
			) {
				setStatus('SUCCESS');
				callbacks?.onSuccess?.({ hash: hash || '0x0' });
				return;
			}
			setStatus('FAILED');
			callbacks?.onError?.(new Error('Transaction failed'));
		} catch (error) {
			setStatus(
				error instanceof WaitForTransactionReceiptTimeoutError
					? 'TIMEOUT'
					: 'FAILED',
			);
			callbacks?.onError?.(error as Error);
		}
	}, [confirmationResult, hash]);

	return status;
};

export default useTransactionStatus;
