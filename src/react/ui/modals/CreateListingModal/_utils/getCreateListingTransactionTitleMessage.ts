import { ConfirmationStatus } from '../../_internal/components/transactionStatusModal/store';

export const getCreateListingTransactionTitle = (
	params: ConfirmationStatus,
) => {
	if (params.isConfirmed) {
		return 'Listing has processed';
	}

	if (params.isFailed) {
		return 'Listing has failed';
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

	return `You just listed ${collectibleName}. It should be confirmed on the blockchain shortly.`;
};
