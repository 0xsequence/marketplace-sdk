/**
 * Enhances transaction errors with user-friendly messages
 * @param error - The original error from the transaction
 * @returns Enhanced error with more readable message
 */
export const enhanceTransactionError = (error: Error): Error => {
	const errorMap = {
		insufficient: 'Insufficient balance to complete this transaction',
		rejected: 'Transaction was cancelled',
		denied: 'Transaction was cancelled',
		network: 'Network error. Please check your connection and try again.',
		fetch: 'Network error. Please check your connection and try again.',
	} as const;

	for (const [key, message] of Object.entries(errorMap)) {
		if (error.message.includes(key)) {
			return new Error(message);
		}
	}

	return error;
};
