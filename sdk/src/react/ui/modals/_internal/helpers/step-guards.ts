export type SuggestedAction =
	| 'fix-form'
	| 'complete-approval'
	| 're-approve'
	| 'connect-wallet'
	| 'wait-for-tx'
	| 'select-fee';

export type GuardResult = {
	canProceed: boolean;
	error?: Error;
	suggestedAction?: SuggestedAction;
};

export function createBaseGuard(params: {
	isFormValid: boolean;
	txReady: boolean;
	walletConnected: boolean;
}): () => GuardResult {
	return () => {
		const { isFormValid, txReady, walletConnected } = params;

		if (!walletConnected) {
			return {
				canProceed: false,
				error: new Error('Please connect your wallet'),
				suggestedAction: 'connect-wallet',
			};
		}

		if (!isFormValid) {
			return {
				canProceed: false,
				error: new Error('Please fix form validation errors'),
				suggestedAction: 'fix-form',
			};
		}

		if (!txReady) {
			return {
				canProceed: false,
				error: new Error('Transaction not ready'),
				suggestedAction: 'wait-for-tx',
			};
		}

		return { canProceed: true };
	};
}

export function createApprovalGuard(params: {
	isFormValid: boolean;
	txReady: boolean;
	walletConnected: boolean;
}): () => GuardResult {
	return createBaseGuard(params);
}

export function createFinalTransactionGuard(params: {
	isFormValid: boolean;
	txReady: boolean;
	walletConnected: boolean;
	requiresApproval: boolean;
	approvalComplete: boolean;
}): () => GuardResult {
	return () => {
		const {
			isFormValid,
			txReady,
			walletConnected,
			requiresApproval,
			approvalComplete,
		} = params;

		if (!walletConnected) {
			return {
				canProceed: false,
				error: new Error('Please connect your wallet'),
				suggestedAction: 'connect-wallet',
			};
		}

		if (!isFormValid) {
			return {
				canProceed: false,
				error: new Error('Please fix form validation errors'),
				suggestedAction: 'fix-form',
			};
		}

		if (requiresApproval && !approvalComplete) {
			return {
				canProceed: false,
				error: new Error('Please approve token first'),
				suggestedAction: 'complete-approval',
			};
		}

		if (!txReady) {
			return {
				canProceed: false,
				error: new Error('Transaction not ready'),
				suggestedAction: 'wait-for-tx',
			};
		}

		return { canProceed: true };
	};
}

export function createFeeGuard(params: {
	feeSelectionVisible: boolean;
}): () => GuardResult {
	return () => {
		const { feeSelectionVisible } = params;

		if (feeSelectionVisible) {
			return {
				canProceed: false,
				error: new Error('Please select a fee option'),
				suggestedAction: 'select-fee',
			};
		}

		return { canProceed: true };
	};
}

export { createApprovalGuard as createApproveStepGuard };
export { createFinalTransactionGuard as createOfferStepGuard };
export { createFeeGuard as createFeeStepGuard };
