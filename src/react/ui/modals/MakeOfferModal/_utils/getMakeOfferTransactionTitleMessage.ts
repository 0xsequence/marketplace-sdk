import { ConfirmationStatus } from '../../_internal/components/transactionStatusModal/store';

export const getMakeOfferTransactionTitle = (params: ConfirmationStatus) => {
	if (params.isConfirmed) {
		return 'Your offer has processed';
	}

	if (params.isFailed) {
		return 'Your offer has failed';
	}

	return 'Your offer is processing';
};

export const getMakeOfferTransactionMessage = (
	params: ConfirmationStatus,
	collectibleName: string,
) => {
	if (params.isConfirmed) {
		return `You just made offer for ${collectibleName}. It’s been confirmed on the blockchain!`;
	}

	if (params.isFailed) {
		return `Your offer for ${collectibleName} has failed. Please try again.`;
	}

	return `You just made offer for ${collectibleName}. It should be confirmed on the blockchain shortly.`;
};
