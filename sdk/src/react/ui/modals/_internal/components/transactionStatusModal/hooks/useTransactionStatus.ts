'use client';

import { TransactionStatus as IndexerTransactionStatus } from '@0xsequence/indexer';
import { skipToken, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { type Hex, WaitForTransactionReceiptTimeoutError } from 'viem';
import { useConfig } from '../../../../../../hooks/config';
import { waitForTransactionReceipt } from '../../../../../../utils/waitForTransactionReceipt';
import type { ModalCallbacks } from '../../../types';
import type { TransactionStatus } from '../store';

const useTransactionStatus = (
	hash: Hex | undefined,
	chainId: number,
	callbacks?: ModalCallbacks,
) => {
	const sdkConfig = useConfig();
	const [status, setStatus] = useState<TransactionStatus>(
		hash ? 'PENDING' : 'SUCCESS',
	);

	const { data: confirmationResult, error } = useQuery({
		queryKey: ['transaction-confirmation', hash, chainId],
		queryFn: hash
			? async () =>
					await waitForTransactionReceipt({ txHash: hash, chainId, sdkConfig })
			: skipToken,
	});

	useEffect(() => {
		if (!hash) {
			setStatus('SUCCESS');
			return;
		}

		if (error) {
			setStatus(
				error instanceof WaitForTransactionReceiptTimeoutError
					? 'TIMEOUT'
					: 'FAILED',
			);
			callbacks?.onError?.(error as Error);
			return;
		}

		if (!confirmationResult) {
			setStatus('PENDING');
			return;
		}

		if (confirmationResult.txnStatus === IndexerTransactionStatus.SUCCESSFUL) {
			setStatus('SUCCESS');
			callbacks?.onSuccess?.({ hash: hash || '0x0' });
			return;
		}
		setStatus('FAILED');
		callbacks?.onError?.(new Error('Transaction failed'));
	}, [confirmationResult, error, hash]);

	return status;
};

export default useTransactionStatus;
