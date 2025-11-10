/**
 * Step guard utilities for modal transaction flows
 * Pure functions for determining if a step can execute
 *
 * All functions in this module are:
 * - Pure (no side effects)
 * - Testable without React
 * - Return clear reasons for blocking
 */

export type SuggestedAction =
	| 'fix-form'
	| 'complete-approval'
	| 're-approve'
	| 'connect-wallet'
	| 'wait-for-tx'
	| 'select-fee';

export type GuardResult = {
	canProceed: boolean;
	reason?: string;
	suggestedAction?: SuggestedAction;
};

/**
 * Base guard that checks wallet connection, form validity, and transaction readiness
 * Used as foundation for more specific guards
 */
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
				reason: 'Please connect your wallet',
				suggestedAction: 'connect-wallet',
			};
		}

		if (!isFormValid) {
			return {
				canProceed: false,
				reason: 'Please fix form validation errors',
				suggestedAction: 'fix-form',
			};
		}

		if (!txReady) {
			return {
				canProceed: false,
				reason: 'Transaction not ready',
				suggestedAction: 'wait-for-tx',
			};
		}

		return { canProceed: true };
	};
}

/**
 * Create guard for approval step
 * Pure function - returns function that checks conditions
 *
 * @example
 * const guard = createApprovalGuard({
 *   isFormValid: true,
 *   txReady: true,
 *   walletConnected: true,
 * });
 * const result = guard(); // { canProceed: true }
 */
export function createApprovalGuard(params: {
	isFormValid: boolean;
	txReady: boolean;
	walletConnected: boolean;
}): () => GuardResult {
	return createBaseGuard(params);
}

/**
 * Create guard for final transaction step (e.g., make offer, accept offer, sell)
 * Checks if approval is complete before proceeding
 *
 * @example
 * const guard = createFinalTransactionGuard({
 *   isFormValid: true,
 *   txReady: true,
 *   walletConnected: true,
 *   requiresApproval: true,
 *   approvalComplete: false,
 * });
 * const result = guard(); // { canProceed: false, reason: "Please approve token first" }
 */
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
				reason: 'Please connect your wallet',
				suggestedAction: 'connect-wallet',
			};
		}

		if (!isFormValid) {
			return {
				canProceed: false,
				reason: 'Please fix form validation errors',
				suggestedAction: 'fix-form',
			};
		}

		if (requiresApproval && !approvalComplete) {
			return {
				canProceed: false,
				reason: 'Please approve token first',
				suggestedAction: 'complete-approval',
			};
		}

		if (!txReady) {
			return {
				canProceed: false,
				reason: 'Transaction not ready',
				suggestedAction: 'wait-for-tx',
			};
		}

		return { canProceed: true };
	};
}

/**
 * Create guard for fee selection step (WaaS only)
 * Pure function - returns function that checks conditions
 *
 * @example
 * const guard = createFeeGuard({
 *   feeSelectionVisible: true,
 * });
 * const result = guard(); // { canProceed: false, reason: "Please select a fee option" }
 */
export function createFeeGuard(params: {
	feeSelectionVisible: boolean;
}): () => GuardResult {
	return () => {
		const { feeSelectionVisible } = params;

		if (feeSelectionVisible) {
			return {
				canProceed: false,
				reason: 'Please select a fee option',
				suggestedAction: 'select-fee',
			};
		}

		return { canProceed: true };
	};
}

// Legacy exports for backward compatibility (MakeOfferModal)
export { createApprovalGuard as createApproveStepGuard };
export { createFinalTransactionGuard as createOfferStepGuard };
export { createFeeGuard as createFeeStepGuard };
