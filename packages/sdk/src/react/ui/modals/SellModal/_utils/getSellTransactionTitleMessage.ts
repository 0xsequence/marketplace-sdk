import type { ConfirmationStatus } from '../../_internal/components/transactionStatusModal/store';

export const getSellTransactionTitle = (params: ConfirmationStatus) => {
	if (params.isConfirmed) {
		return 'Your sale has processed';
	}

	if (params.isFailed) {
		return 'Your sale has failed';
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

	return `You just sold ${collectibleName}. It should be confirmed on the blockchain shortly.`;
};
