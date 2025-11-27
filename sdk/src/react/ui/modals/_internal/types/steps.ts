export type StepStatus = 'idle' | 'pending' | 'complete' | 'error';

export type TransactionResult =
	| { type: 'transaction'; hash: string }
	| { type: 'signature'; orderId: string }
	| { type: 'sponsored'; hash: string };

export type SuggestedAction =
	| 'fix-form'
	| 'complete-approval'
	| 're-approve'
	| 'connect-wallet'
	| 'wait-for-tx'
	| 'select-fee';

export type StepGuardResult = {
	canProceed: boolean;
	reason?: string;
	suggestedAction?: SuggestedAction;
};

export type BaseStep = {
	label: string;
	status: StepStatus;
	isPending: boolean;
	isComplete: boolean;
	isDisabled: boolean;
	disabledReason: string | null;
	error: Error | null;
};

export type FormStep = {
	label: string;
	status: 'idle' | 'complete';
	isValid: boolean;
	errors: Record<string, string | null>;
};

export type FeeStep = {
	label: string;
	status: 'idle' | 'selecting' | 'complete';
	isSponsored: boolean;
	isSelecting: boolean;
	selectedOption: unknown;
	show: () => void;
	cancel: () => void;
};

export type ApprovalStep = BaseStep & {
	canExecute: boolean;
	result: TransactionResult | null;
	invalidated?: boolean;
	invalidationReason?: string | null;
	execute: () => Promise<void>;
	reset: () => void;
};

export type TransactionStep = BaseStep & {
	canExecute: boolean;
	result: TransactionResult | null;
	execute: () => Promise<void>;
};

export type FlowState = {
	status: 'idle' | 'pending' | 'complete' | 'error';
	isPending: boolean;
	isComplete: boolean;
	currentStep: string;
	nextStep: string | null;
	progress: {
		current: number;
		total: number;
		percent: number;
	};
	hasInvalidatedSteps: boolean;
};

export type ModalSteps<TFinalStepName extends string = 'transaction'> = {
	form?: FormStep;
	fee?: FeeStep;
	approval?: ApprovalStep;
} & {
	[K in TFinalStepName]: TransactionStep;
};

export type ModalContext<TSteps extends ModalSteps = ModalSteps> = {
	isOpen: boolean;
	close: () => void;
	steps: TSteps;
	flow: FlowState;
	error: Error | null;
};

export type StepName<T extends ModalSteps> = keyof T;

export function isTransactionStep(
	step: unknown,
): step is TransactionStep | ApprovalStep {
	return (
		typeof step === 'object' &&
		step !== null &&
		'execute' in step &&
		'result' in step
	);
}

export function isApprovalStep(step: unknown): step is ApprovalStep {
	return (
		isTransactionStep(step) &&
		'reset' in step &&
		typeof (step as ApprovalStep).reset === 'function'
	);
}

export function isFeeStep(step: unknown): step is FeeStep {
	return (
		typeof step === 'object' &&
		step !== null &&
		'isSponsored' in step &&
		'show' in step &&
		'cancel' in step
	);
}

export function isFormStep(step: unknown): step is FormStep {
	return (
		typeof step === 'object' &&
		step !== null &&
		'isValid' in step &&
		'errors' in step
	);
}
