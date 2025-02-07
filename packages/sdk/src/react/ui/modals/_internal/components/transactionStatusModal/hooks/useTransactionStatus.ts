import { useState } from 'react';
import { useWallet } from '../../../../../../_internal/wallet/useWallet';
import { TransactionStatus } from '../store';
import { TransactionStatus as IndexerTransactionStatus } from '@0xsequence/indexer';
import { Hex, WaitForTransactionReceiptTimeoutError } from 'viem';
import { ModalCallbacks } from '../../../types';

const useTransactionStatus = (
	hash: Hex | undefined,
	chainId: string,
	callbacks?: ModalCallbacks,
) => {
	const { wallet } = useWallet();
	const [status, setStatus] = useState<TransactionStatus>(
		hash ? 'PENDING' : 'SUCCESS',
	);

	if (hash && status === 'PENDING') {
		wallet
			?.handleConfirmTransactionStep(hash, Number(chainId))
			.then((receipt) => {
				if (receipt?.txnStatus === IndexerTransactionStatus.SUCCESSFUL) {
					setStatus('SUCCESS');
					callbacks?.onSuccess?.({ hash: hash || '0x0' });
				} else {
					throw new Error('Transaction failed');
				}
			})
			.catch((error) => {
				callbacks?.onError?.(error as Error);
				if (error instanceof WaitForTransactionReceiptTimeoutError) {
					setStatus('TIMEOUT');
				} else {
					setStatus('FAILED');
				}
			});
	}

	return status;
};

export default useTransactionStatus;
