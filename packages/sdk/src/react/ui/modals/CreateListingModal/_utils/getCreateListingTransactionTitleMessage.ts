import type { ConfirmationStatus } from '../../_internal/components/transactionStatusModal/store';

export const getCreateListingTransactionTitle = (
	params: ConfirmationStatus,
) => {
	if (params.isConfirmed) {
		return 'Listing has processed';
	}

	if (params.isFailed) {
		return 'Listing has failed';
	}

	if (params.isTimeout) {
		return 'Your listing is taking longer than expected';
	}

	return 'Listing is processing';
};

export const getCreateListingTransactionMessage = (
	params: ConfirmationStatus,
	collectibleName: string,
) => {
	if (params.isConfirmed) {
		return `You just listed ${collectibleName}. It’s been confirmed on the blockchain!`;
	}

	if (params.isFailed) {
		return `Your listing of ${collectibleName} has failed. Please try again.`;
	}

	if (params.isTimeout) {
		return `Your listing is still being processed. This may take a little longer than usual. Please continue with the transaction hash below to check the status on explorer.`;
	}

	return `You just listed ${collectibleName}. It should be confirmed on the blockchain shortly.`;
};
