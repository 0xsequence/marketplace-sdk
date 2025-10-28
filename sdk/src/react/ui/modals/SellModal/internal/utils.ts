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
	if (approvalMutationPending)
		return 'Confirm the token approval in your wallet';
	if (executeSellMutationPending)
		return 'Confirm the offer acceptance in your wallet';
	return null;
};
