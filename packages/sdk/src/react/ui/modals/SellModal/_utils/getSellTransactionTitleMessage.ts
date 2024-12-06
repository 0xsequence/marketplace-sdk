import type { ConfirmationStatus } from '../../_internal/components/transactionStatusModal/store';

export const getSellTransactionTitle = (params: ConfirmationStatus) => {
	if (params.isConfirmed) {
		return 'Your sale has processed';
	}

	if (params.isFailed) {
		return 'Your sale has failed';
	}

	if (params.isTimeout) {
		return 'Your sale is taking longer than expected';
	}

	return 'Your sale is processing';
};

export const getSellTransactionMessage = (
	params: ConfirmationStatus,
	collectibleName: string,
) => {
	if (params.isConfirmed) {
		return `You just sold ${collectibleName}. It’s been confirmed on the blockchain!`;
	}

	if (params.isFailed) {
		return `Your sale of ${collectibleName} has failed. Please try again.`;
	}

	if (params.isTimeout) {
		return `Your sale is still being processed. This may take a little longer than usual. Please continue with the transaction hash below to check the status on explorer.`;
	}

	return `You just sold ${collectibleName}. It should be confirmed on the blockchain shortly.`;
};
