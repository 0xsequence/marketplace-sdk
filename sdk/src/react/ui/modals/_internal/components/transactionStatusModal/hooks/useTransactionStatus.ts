'use client';

import { skipToken, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { type Hex, WaitForTransactionReceiptTimeoutError } from 'viem';
import { useConfig } from '../../../../../../hooks/config';
import { waitForTransactionReceipt } from '../../../../../../utils/waitForTransactionReceipt';
import type { TransactionStatus } from '../store';

const useTransactionStatus = (hash: Hex | undefined, chainId: number) => {
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
			return;
		}

		if (!confirmationResult) {
			setStatus('PENDING');
			return;
		}

		// If we have a confirmation result and no error, the transaction succeeded
		// The Indexer will only return a receipt for successful transactions
		setStatus('SUCCESS');
	}, [confirmationResult, error, hash]);

	return status;
};

export default useTransactionStatus;
