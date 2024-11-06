import type { ConfirmationStatus } from '../../_internal/components/transactionStatusModal/store';

export const getTransferTransactionTitle = (params: ConfirmationStatus) => {
	if (params.isConfirmed) {
		return 'Transfer has processed';
	}

	if (params.isFailed) {
		return 'Transfer has failed';
	}

	return 'Transfer is processing';
};

export const getTransferTransactionMessage = (
	params: ConfirmationStatus,
	collectibleName: string,
) => {
	if (params.isConfirmed) {
		return `You just tranferred ${collectibleName}. It’s been confirmed on the blockchain!`;
	}

	if (params.isFailed) {
		return `Transferring ${collectibleName} has failed. Please try again.`;
	}

	return `You just transferred ${collectibleName}. It should be confirmed on the blockchain shortly.`;
};
