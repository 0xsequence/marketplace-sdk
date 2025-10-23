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

	return 'Unknown status';
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
		return `You just sold ${collectibleName}. It's been confirmed on the blockchain!`;
	}
	if (isFailed) {
		return `${collectibleName} could not be sold. Please try again.`;
	}

	return 'Unknown status'; // Default return
};

export const getModalTitle = (
	isProcessing: boolean,
	hasError: boolean,
): string => {
	if (isProcessing) return 'Processing offer...';
	if (hasError) return 'Offer acceptance failed';
	return 'You have an offer';
};

export const getWalletActionMessage = (
	isProcessing: boolean,
	isGeneratingSteps: boolean,
	transactionPending: boolean,
	executeSellMutationPending: boolean,
	approvalMutationPending?: boolean,
): string | null => {
	if (!isProcessing) return null;
	if (isGeneratingSteps) return 'Preparing transaction...';
	if (transactionPending) return 'Check your wallet to confirm the transaction';
	if (approvalMutationPending) return 'Confirm the NFT approval in your wallet';
	if (executeSellMutationPending)
		return 'Confirm the offer acceptance in your wallet';
	return null;
};
