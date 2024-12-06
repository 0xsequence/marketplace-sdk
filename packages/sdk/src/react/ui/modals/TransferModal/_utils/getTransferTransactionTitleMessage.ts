import type { ConfirmationStatus } from '../../_internal/components/transactionStatusModal/store';

export const getTransferTransactionTitle = (params: ConfirmationStatus) => {
	if (params.isConfirmed) {
		return 'Transfer has processed';
	}

	if (params.isFailed) {
		return 'Transfer has failed';
	}

	if (params.isTimeout) {
		return 'Transfer is taking longer than expected';
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

	if (params.isTimeout) {
		return `Transfer is still being processed. This may take a little longer than usual. Please continue with the transaction hash below to check the status on explorer.`;
	}

	return `You just transferred ${collectibleName}. It should be confirmed on the blockchain shortly.`;
};
