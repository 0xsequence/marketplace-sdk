/**
 * Flow state utilities for modal transaction flows
 *
 * Pure functions for computing modal flow state from step configuration
 * Eliminates manual step counting and status checking in each modal
 */

import type {
	ApprovalStep,
	FeeStep,
	FlowState,
	FormStep,
	ModalSteps,
	StepStatus,
	TransactionStep,
} from '../types/steps';
import {
	isApprovalStep,
	isFeeStep,
	isFormStep,
	isTransactionStep,
} from '../types/steps';

// ============================================
// STEP HELPERS
// ============================================

type StepEntry = {
	name: string;
	step: FormStep | FeeStep | ApprovalStep | TransactionStep;
};

/**
 * Convert ModalSteps object to array of step entries
 * Maintains order: form → fee → approval → [finalStep]
 */
export function getStepEntries(
	steps: Record<string, FormStep | FeeStep | ApprovalStep | TransactionStep>,
): StepEntry[] {
	const entries: StepEntry[] = [];

	// Always check in this order for consistent flow
	if (steps.form) {
		entries.push({ name: 'form', step: steps.form });
	}

	if (steps.fee) {
		entries.push({ name: 'fee', step: steps.fee });
	}

	if (steps.approval) {
		entries.push({ name: 'approval', step: steps.approval });
	}

	// Find the final step (any key that's not form/fee/approval)
	const finalStepKey = Object.keys(steps).find(
		(key) => key !== 'form' && key !== 'fee' && key !== 'approval',
	);

	if (finalStepKey) {
		const finalStep = steps[finalStepKey as keyof typeof steps];
		if (finalStep) {
			entries.push({
				name: finalStepKey,
				step: finalStep as TransactionStep,
			});
		}
	}

	return entries;
}

/**
 * Get status of a step (normalized across different step types)
 */
export function getStepStatus(
	step: FormStep | FeeStep | ApprovalStep | TransactionStep,
): StepStatus {
	if (isFormStep(step)) {
		return step.status === 'complete' ? 'complete' : 'idle';
	}

	if (isFeeStep(step)) {
		if (step.status === 'complete') return 'complete';
		if (step.status === 'selecting') return 'pending';
		return 'idle';
	}

	if (isTransactionStep(step)) {
		return step.status;
	}

	return 'idle';
}

/**
 * Check if a step is complete
 */
export function isStepComplete(
	step: FormStep | FeeStep | ApprovalStep | TransactionStep,
): boolean {
	if (isFormStep(step)) {
		return step.status === 'complete' && step.isValid;
	}

	if (isFeeStep(step)) {
		return step.status === 'complete';
	}

	if (isTransactionStep(step)) {
		return step.isComplete;
	}

	return false;
}

/**
 * Check if a step is disabled
 */
export function isStepDisabled(
	step: FormStep | FeeStep | ApprovalStep | TransactionStep,
): boolean {
	if (isFormStep(step)) {
		return false; // Form is never disabled
	}

	if (isFeeStep(step)) {
		return false; // Fee selection is never disabled when shown
	}

	if (isTransactionStep(step)) {
		return step.isDisabled;
	}

	return false;
}

/**
 * Check if a step is pending (actively processing)
 */
export function isStepPending(
	step: FormStep | FeeStep | ApprovalStep | TransactionStep,
): boolean {
	if (isFormStep(step)) {
		return false; // Form is never pending
	}

	if (isFeeStep(step)) {
		return step.status === 'selecting';
	}

	if (isTransactionStep(step)) {
		return step.isPending;
	}

	return false;
}

// ============================================
// FLOW STATE COMPUTATION
// ============================================

/**
 * Compute complete flow state from modal steps
 *
 * This is the main utility function that eliminates manual counting
 * in each modal context
 *
 * @param steps - The modal steps object (accepts any final step name)
 * @returns FlowState - Computed flow state
 *
 * @example
 * ```typescript
 * const flow = computeFlowState({
 *   form: { status: 'complete', isValid: true, errors: {} },
 *   approval: { status: 'complete', ... },
 *   offer: { status: 'pending', ... }
 * });
 *
 * // flow.currentStep === 'offer'
 * // flow.progress.percent === 66 (2 of 3 complete)
 * ```
 */
export function computeFlowState(
	steps: Record<string, FormStep | FeeStep | ApprovalStep | TransactionStep>,
): FlowState {
	const stepEntries = getStepEntries(steps);

	// Count completed steps
	const totalSteps = stepEntries.length;
	const completedSteps = stepEntries.filter(({ step }) =>
		isStepComplete(step),
	).length;

	// Find current step (first non-complete, non-disabled step)
	const currentStepEntry = stepEntries.find(
		({ step }) => !isStepComplete(step) && !isStepDisabled(step),
	);
	const currentStep =
		currentStepEntry?.name || stepEntries[0]?.name || 'unknown';

	// Find next actionable step (first idle, non-disabled step)
	const nextStepEntry = stepEntries.find(({ step }) => {
		const status = getStepStatus(step);
		return status === 'idle' && !isStepDisabled(step);
	});
	const nextStep = nextStepEntry?.name || null;

	// Check if any step is pending
	const isPending = stepEntries.some(({ step }) => isStepPending(step));

	// Check if all steps are complete
	const isComplete = completedSteps === totalSteps && totalSteps > 0;

	// Check if any step has error
	const hasError = stepEntries.some(({ step }) => {
		if (isTransactionStep(step)) {
			return step.status === 'error' || step.error !== null;
		}
		return false;
	});

	// Determine overall status
	let status: FlowState['status'] = 'idle';
	if (isPending) {
		status = 'pending';
	} else if (hasError) {
		status = 'error';
	} else if (isComplete) {
		status = 'complete';
	}

	// Check for invalidated steps (approval invalidation)
	const hasInvalidatedSteps = stepEntries.some(({ step }) => {
		if (isApprovalStep(step)) {
			return step.invalidated === true;
		}
		return false;
	});

	// Calculate progress percentage
	const progressPercent =
		totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

	return {
		status,
		isPending,
		isComplete,
		currentStep,
		nextStep,
		progress: {
			current: completedSteps,
			total: totalSteps,
			percent: progressPercent,
		},
		hasInvalidatedSteps,
	};
}

// ============================================
// CONVENIENCE HELPERS
// ============================================

/**
 * Get a human-readable label for a step
 */
export function getStepLabel(stepName: string): string {
	const labels: Record<string, string> = {
		form: 'Set Details',
		fee: 'Select Fee',
		approval: 'Approve Token',
		offer: 'Make Offer',
		sell: 'Accept Offer',
		listing: 'Create Listing',
		list: 'Create Listing',
		buy: 'Complete Purchase',
	};

	return labels[stepName] || stepName;
}

/**
 * Get a human-readable description for a step
 */
export function getStepDescription(stepName: string): string | undefined {
	const descriptions: Record<string, string> = {
		form: 'Enter price, quantity, and expiry',
		fee: 'Choose gas fee option',
		approval: 'Allow marketplace to access your tokens',
		offer: 'Sign transaction to create your offer',
		sell: 'Sign transaction to accept the offer',
		listing: 'Sign transaction to create your listing',
		list: 'Sign transaction to create your listing',
		buy: 'Sign transaction to complete purchase',
	};

	return descriptions[stepName];
}

/**
 * Check if a specific step needs user action
 */
export function stepNeedsAction(
	step: FormStep | FeeStep | ApprovalStep | TransactionStep,
): boolean {
	const status = getStepStatus(step);
	return status === 'idle' && !isStepDisabled(step);
}

/**
 * Get all steps that need user action
 */
export function getActionableSteps(steps: ModalSteps): Array<{
	name: string;
	step: FormStep | FeeStep | ApprovalStep | TransactionStep;
}> {
	return getStepEntries(steps).filter(({ step }) => stepNeedsAction(step));
}

/**
 * Get the first step that has an error
 */
export function getFirstErrorStep(
	steps: ModalSteps,
): { name: string; step: TransactionStep | ApprovalStep } | null {
	const entry = getStepEntries(steps).find(({ step }) => {
		if (isTransactionStep(step)) {
			return step.status === 'error' || step.error !== null;
		}
		return false;
	});

	return entry
		? { name: entry.name, step: entry.step as TransactionStep | ApprovalStep }
		: null;
}

/**
 * Execute the next actionable step
 * Returns the step name that was executed, or null if no step can be executed
 *
 * @example
 * ```typescript
 * const result = await executeNextStep(steps);
 * if (result) {
 *   console.log(`Executed step: ${result.stepName}`);
 * }
 * ```
 */
export async function executeNextStep(
	steps: ModalSteps,
): Promise<{ stepName: string } | null> {
	const stepEntries = getStepEntries(steps);

	// Find the first actionable step
	const nextStep = stepEntries.find(({ step }) => {
		// Fee step can be "shown" but doesn't execute
		if (isFeeStep(step) && step.status !== 'complete') {
			return true;
		}

		// Transaction steps can be executed
		if (isTransactionStep(step)) {
			const status = getStepStatus(step);
			return status === 'idle' && !isStepDisabled(step);
		}

		return false;
	});

	if (!nextStep) {
		return null;
	}

	// Execute fee step (show fee selector)
	if (isFeeStep(nextStep.step)) {
		nextStep.step.show();
		return { stepName: nextStep.name };
	}

	// Execute transaction step
	if (isTransactionStep(nextStep.step)) {
		await nextStep.step.execute();
		return { stepName: nextStep.name };
	}

	return null;
}
