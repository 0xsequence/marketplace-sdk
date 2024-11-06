import type { ConfirmationStatus } from '../_internal/components/transactionStatusModal/store';

export const getSellModalTitle = ({
	isConfirming,
	isConfirmed,
	isFailed,
}: ConfirmationStatus): string => {
	if (isConfirming) {
		return 'Your sale is processing';
	}
	if (isConfirmed) {
		return 'Your sale has processed';
	}
	if (isFailed) {
		return 'Your sale has failed';
	}

	return 'Unknown status'; // Default return
};

export const getSellModalMessage = ({
	isConfirming,
	isConfirmed,
	isFailed,
	collectibleName,
}: ConfirmationStatus & { collectibleName?: string }) => {
	if (isConfirming) {
		return `You just sold ${collectibleName}. It should be confirmed on the blockchain shortly.`;
	}
	if (isConfirmed) {
		return `You just sold ${collectibleName}. It’s been confirmed on the blockchain!`;
	}
	if (isFailed) {
		return `${collectibleName} could not be sold. Please try again.`;
	}

	return 'Unknown status'; // Default return
};
