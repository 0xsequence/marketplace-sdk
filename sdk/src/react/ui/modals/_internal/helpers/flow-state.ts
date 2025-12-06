import type {
	ApprovalStep,
	BaseStepName,
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

type StepEntry = {
	name: string;
	step: FormStep | FeeStep | ApprovalStep | TransactionStep;
};

export function getStepEntries(
	steps: Record<string, FormStep | FeeStep | ApprovalStep | TransactionStep>,
): StepEntry[] {
	const entries: StepEntry[] = [];

	if (steps.form) {
		entries.push({ name: 'form', step: steps.form });
	}

	if (steps.fee) {
		entries.push({ name: 'fee', step: steps.fee });
	}

	if (steps.approval) {
		entries.push({ name: 'approval', step: steps.approval });
	}

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

export function getStepStatus(
	step: FormStep | FeeStep | ApprovalStep | TransactionStep,
): StepStatus {
	if (isFormStep(step)) {
		return step.status === 'success' ? 'success' : 'idle';
	}

	if (isFeeStep(step)) {
		if (step.status === 'success') return 'success';
		if (step.status === 'selecting') return 'pending';
		return 'idle';
	}

	if (isTransactionStep(step)) {
		return step.status;
	}

	return 'idle';
}

export function isStepComplete(
	step: FormStep | FeeStep | ApprovalStep | TransactionStep,
): boolean {
	if (isFormStep(step)) {
		return step.status === 'success' && step.isValid;
	}

	if (isFeeStep(step)) {
		return step.status === 'success';
	}

	if (isTransactionStep(step)) {
		return step.isSuccess;
	}

	return false;
}

export function isStepDisabled(
	step: FormStep | FeeStep | ApprovalStep | TransactionStep,
): boolean {
	if (isFormStep(step)) {
		return false;
	}

	if (isFeeStep(step)) {
		return false;
	}

	if (isTransactionStep(step)) {
		return step.isDisabled;
	}

	return false;
}

export function isStepPending(
	step: FormStep | FeeStep | ApprovalStep | TransactionStep,
): boolean {
	if (isFormStep(step)) {
		return false;
	}

	if (isFeeStep(step)) {
		return step.status === 'selecting';
	}

	if (isTransactionStep(step)) {
		return step.isPending;
	}

	return false;
}

export function computeFlowState<TFinalStepName extends string = 'transaction'>(
	steps: Record<string, FormStep | FeeStep | ApprovalStep | TransactionStep>,
): FlowState<TFinalStepName> {
	const stepEntries = getStepEntries(steps);

	const totalSteps = stepEntries.length;
	const completedSteps = stepEntries.filter(({ step }) =>
		isStepComplete(step),
	).length;

	const currentStepEntry = stepEntries.find(
		({ step }) => !isStepComplete(step) && !isStepDisabled(step),
	);
	const currentStep = (currentStepEntry?.name ||
		stepEntries[0]?.name ||
		'form') as BaseStepName | TFinalStepName;

	const nextStepEntry = stepEntries.find(({ step }) => {
		const status = getStepStatus(step);
		return status === 'idle' && !isStepDisabled(step);
	});
	const nextStep = (nextStepEntry?.name || null) as
		| BaseStepName
		| TFinalStepName
		| null;

	const isPending = stepEntries.some(({ step }) => isStepPending(step));
	const isSuccess = completedSteps === totalSteps && totalSteps > 0;

	const hasError = stepEntries.some(({ step }) => {
		if (isTransactionStep(step)) {
			return step.status === 'error' || step.error !== null;
		}
		return false;
	});

	let status: FlowState['status'] = 'idle';
	if (isPending) {
		status = 'pending';
	} else if (hasError) {
		status = 'error';
	} else if (isSuccess) {
		status = 'success';
	}

	const hasInvalidatedSteps = stepEntries.some(({ step }) => {
		if (isApprovalStep(step)) {
			return step.invalidated === true;
		}
		return false;
	});

	const progressPercent =
		totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

	const allSteps = stepEntries.map(({ name, step }) => ({
		name: name as BaseStepName | TFinalStepName,
		status: getStepStatus(step),
	}));

	return {
		status,
		isPending,
		isSuccess,
		currentStep,
		nextStep,
		progress: {
			current: completedSteps,
			total: totalSteps,
			percent: progressPercent,
		},
		allSteps,
		hasInvalidatedSteps,
	};
}

export function stepNeedsAction(
	step: FormStep | FeeStep | ApprovalStep | TransactionStep,
): boolean {
	const status = getStepStatus(step);
	return status === 'idle' && !isStepDisabled(step);
}

export function getActionableSteps(steps: ModalSteps): Array<{
	name: string;
	step: FormStep | FeeStep | ApprovalStep | TransactionStep;
}> {
	return getStepEntries(steps).filter(({ step }) => stepNeedsAction(step));
}

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

export async function executeNextStep(
	steps: ModalSteps,
): Promise<{ stepName: string } | null> {
	const stepEntries = getStepEntries(steps);

	const nextStep = stepEntries.find(({ step }) => {
		if (isFeeStep(step) && step.status !== 'success') {
			return true;
		}

		if (isTransactionStep(step)) {
			const status = getStepStatus(step);
			return status === 'idle' && !isStepDisabled(step);
		}

		return false;
	});

	if (!nextStep) {
		return null;
	}

	if (isFeeStep(nextStep.step)) {
		nextStep.step.show();
		return { stepName: nextStep.name };
	}

	if (isTransactionStep(nextStep.step)) {
		await nextStep.step.execute();
		return { stepName: nextStep.name };
	}

	return null;
}
