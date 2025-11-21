import type { ListingStepId } from '../context';

export type GuardCheck = {
	name: string;
	passed: boolean;
	message: string;
};

export type GuardResult = {
	canProceed: boolean;
	reason?: string;
	failedChecks?: GuardCheck[];
	suggestedAction?:
		| 'fix-form'
		| 'complete-approval'
		| 're-approve'
		| 'connect-wallet'
		| 'wait-for-tx';
};

/**
 * Compute step disabled state and reason
 * Pure function - no React hooks, fully testable
 */
export function computeStepDisabledState(
	stepId: ListingStepId,
	params: {
		isFormValid: boolean;
		txReady: boolean;
		requiresApproval: boolean;
		approvalComplete: boolean;
		walletConnected: boolean;
	},
): { isDisabled: boolean; disabledReason: string | null } {
	switch (stepId) {
		case 'form':
			return { isDisabled: false, disabledReason: null };

		case 'waasFee':
			return { isDisabled: false, disabledReason: null };

		case 'approve':
			if (!params.walletConnected) {
				return { isDisabled: true, disabledReason: 'Connect wallet first' };
			}
			if (!params.isFormValid) {
				return {
					isDisabled: true,
					disabledReason: 'Complete listing details first',
				};
			}
			if (!params.txReady) {
				return { isDisabled: true, disabledReason: 'Preparing transaction...' };
			}
			return { isDisabled: false, disabledReason: null };

		case 'list':
			if (!params.walletConnected) {
				return { isDisabled: true, disabledReason: 'Connect wallet first' };
			}
			if (!params.isFormValid) {
				return {
					isDisabled: true,
					disabledReason: 'Complete listing details first',
				};
			}
			if (!params.txReady) {
				return { isDisabled: true, disabledReason: 'Preparing transaction...' };
			}
			if (params.requiresApproval && !params.approvalComplete) {
				return {
					isDisabled: true,
					disabledReason: 'Complete token approval first',
				};
			}
			return { isDisabled: false, disabledReason: null };

		default:
			return { isDisabled: false, disabledReason: null };
	}
}

/**
 * Create guard function for form step
 * Pure function - no React hooks, fully testable
 */
export function createFormStepGuard(params: {
	isFormValid: boolean;
	validationErrors: Record<string, string | null>;
}): () => GuardResult {
	return () => {
		if (!params.isFormValid) {
			const failedChecks = Object.entries(params.validationErrors)
				.filter(([_, error]) => error !== null)
				.map(([field, error]) => ({
					name: field,
					passed: false,
					message: error || `Invalid ${field}`,
				}));

			return {
				canProceed: false,
				reason: 'Complete all required fields',
				failedChecks,
				suggestedAction: 'fix-form',
			};
		}

		return { canProceed: true };
	};
}

/**
 * Create guard function for approve step
 * Pure function - no React hooks, fully testable
 */
export function createApproveStepGuard(params: {
	isFormValid: boolean;
	txReady: boolean;
	walletConnected: boolean;
}): () => GuardResult {
	return () => {
		const checks: GuardCheck[] = [
			{
				name: 'walletConnected',
				passed: params.walletConnected,
				message: 'Wallet must be connected',
			},
			{
				name: 'formValid',
				passed: params.isFormValid,
				message: 'Form must be valid',
			},
			{
				name: 'txReady',
				passed: params.txReady,
				message: 'Transaction must be prepared',
			},
		];

		const failedChecks = checks.filter((c) => !c.passed);

		if (failedChecks.length > 0) {
			const suggestedAction = !params.walletConnected
				? ('connect-wallet' as const)
				: !params.isFormValid
					? ('fix-form' as const)
					: ('wait-for-tx' as const);

			return {
				canProceed: false,
				reason: failedChecks[0].message,
				failedChecks,
				suggestedAction,
			};
		}

		return { canProceed: true };
	};
}

/**
 * Create guard function for list step
 * Pure function - no React hooks, fully testable
 */
export function createListStepGuard(params: {
	isFormValid: boolean;
	txReady: boolean;
	requiresApproval: boolean;
	approvalComplete: boolean;
	walletConnected: boolean;
	isApprovalInvalidated: boolean;
}): () => GuardResult {
	return () => {
		const checks: GuardCheck[] = [
			{
				name: 'walletConnected',
				passed: params.walletConnected,
				message: 'Wallet must be connected',
			},
			{
				name: 'formValid',
				passed: params.isFormValid,
				message: 'Form must be valid',
			},
			{
				name: 'txReady',
				passed: params.txReady,
				message: 'Transaction must be prepared',
			},
			{
				name: 'approvalComplete',
				passed: !params.requiresApproval || params.approvalComplete,
				message: 'Token approval must be completed',
			},
			{
				name: 'notInvalidated',
				passed: !params.isApprovalInvalidated,
				message: 'Approval was invalidated - please re-approve',
			},
		];

		const failedChecks = checks.filter((c) => !c.passed);

		if (failedChecks.length > 0) {
			const suggestedAction = !params.walletConnected
				? ('connect-wallet' as const)
				: !params.isFormValid
					? ('fix-form' as const)
					: params.isApprovalInvalidated
						? ('re-approve' as const)
						: !params.approvalComplete
							? ('complete-approval' as const)
							: ('wait-for-tx' as const);

			return {
				canProceed: false,
				reason: failedChecks[0].message,
				failedChecks,
				suggestedAction,
			};
		}

		return { canProceed: true };
	};
}
