/**
 * Common step types for modal transaction flows
 *
 * This module provides a unified type system for all marketplace modals
 * (MakeOfferModal, SellModal, CreateListingModal, etc.)
 *
 * Design principles:
 * - Named properties over arrays for better DX
 * - Strongly typed statuses for type safety
 * - Discriminated unions for transaction results
 * - Pure functions for step guards
 */

// ============================================
// CORE TYPES
// ============================================

/**
 * Base step status - applies to all step types
 */
export type StepStatus = 'idle' | 'pending' | 'complete' | 'error';

/**
 * Transaction result discriminated union
 * Covers both on-chain transactions and off-chain signatures
 */
export type TransactionResult =
	| { type: 'transaction'; hash: string }
	| { type: 'signature'; orderId: string }
	| { type: 'sponsored'; hash: string };

/**
 * Suggested action for users when a step is blocked
 */
export type SuggestedAction =
	| 'fix-form'
	| 'complete-approval'
	| 're-approve'
	| 'connect-wallet'
	| 'wait-for-tx'
	| 'select-fee';

/**
 * Step guard result - output from pure guard functions
 */
export type StepGuardResult = {
	canProceed: boolean;
	reason?: string;
	suggestedAction?: SuggestedAction;
};

// ============================================
// STEP TYPES
// ============================================

/**
 * Base step - common fields for transaction steps
 */
export type BaseStep = {
	status: StepStatus;
	isPending: boolean;
	isComplete: boolean;
	isDisabled: boolean;
	disabledReason: string | null;
	error: Error | null;
};

/**
 * Form validation step
 * Used when form inputs need validation before proceeding
 *
 * @example
 * ```typescript
 * steps: {
 *   form: {
 *     status: 'complete',
 *     isValid: true,
 *     errors: {}
 *   }
 * }
 * ```
 */
export type FormStep = {
	status: 'idle' | 'complete';
	isValid: boolean;
	errors: Record<string, string | null>;
};

/**
 * Fee selection step (WaaS only)
 * User must select gas fee option before proceeding
 *
 * @example
 * ```typescript
 * steps: {
 *   fee: {
 *     status: 'selecting',
 *     isSponsored: false,
 *     isSelecting: true,
 *     selectedOption: { ... },
 *     show: () => openFeeModal(),
 *     cancel: () => closeFeeModal()
 *   }
 * }
 * ```
 */
export type FeeStep = {
	status: 'idle' | 'selecting' | 'complete';
	isSponsored: boolean;
	isSelecting: boolean;
	selectedOption: unknown; // From @0xsequence/connect
	show: () => void;
	cancel: () => void;
};

/**
 * Approval transaction step
 * Required when marketplace needs token access
 *
 * Features:
 * - Can be invalidated when form changes (e.g., currency change)
 * - Provides transaction hash on success
 * - Can be reset after invalidation
 *
 * @example
 * ```typescript
 * steps: {
 *   approval: {
 *     status: 'complete',
 *     canExecute: false,
 *     isPending: false,
 *     isComplete: true,
 *     isDisabled: false,
 *     disabledReason: null,
 *     error: null,
 *     result: { type: 'transaction', hash: '0x...' },
 *     invalidated: false,
 *     execute: async () => { ... },
 *     reset: () => { ... }
 *   }
 * }
 * ```
 */
export type ApprovalStep = BaseStep & {
	canExecute: boolean;
	result: TransactionResult | null;
	invalidated?: boolean;
	invalidationReason?: string | null;
	execute: () => Promise<void>;
	reset: () => void;
};

/**
 * Final transaction step
 * The main action (make offer, accept offer, create listing, etc.)
 *
 * @example
 * ```typescript
 * steps: {
 *   offer: {
 *     status: 'idle',
 *     canExecute: true,
 *     isPending: false,
 *     isComplete: false,
 *     isDisabled: false,
 *     disabledReason: null,
 *     error: null,
 *     result: null,
 *     execute: async () => { ... }
 *   }
 * }
 * ```
 */
export type TransactionStep = BaseStep & {
	canExecute: boolean;
	result: TransactionResult | null;
	execute: () => Promise<void>;
};

// ============================================
// MODAL FLOW TYPES
// ============================================

/**
 * Flow state - computed from steps
 * Provides high-level information about the modal's progress
 */
export type FlowState = {
	status: 'idle' | 'pending' | 'complete' | 'error';
	isPending: boolean;
	isComplete: boolean;
	currentStep: string; // Current active step name
	nextStep: string | null; // Next actionable step name
	progress: {
		current: number;
		total: number;
		percent: number;
	};
	hasInvalidatedSteps: boolean;
};

/**
 * Modal steps configuration
 * Uses named properties for clear API and better TypeScript support
 *
 * Generic parameter TFinalStepName allows customizing the final step name
 * (e.g., 'offer', 'sell', 'listing')
 *
 * @example
 * ```typescript
 * // MakeOfferModal
 * type MakeOfferSteps = ModalSteps<'offer'>;
 * // Results in: { form?, fee?, approval?, offer: TransactionStep }
 *
 * // SellModal
 * type SellSteps = ModalSteps<'sell'>;
 * // Results in: { form?, fee?, approval?, sell: TransactionStep }
 * ```
 */
export type ModalSteps<TFinalStepName extends string = 'transaction'> = {
	form?: FormStep;
	fee?: FeeStep;
	approval?: ApprovalStep;
} & {
	[K in TFinalStepName]: TransactionStep;
};

/**
 * Complete modal context type
 * Base interface that all modal contexts should extend
 *
 * @example
 * ```typescript
 * export type MakeOfferModalContext = ModalContext<ModalSteps<'offer'>> & {
 *   item: { ... };
 *   form: { ... };
 *   currencies: { ... };
 * };
 * ```
 */
export type ModalContext<TSteps extends ModalSteps = ModalSteps> = {
	isOpen: boolean;
	close: () => void;
	steps: TSteps;
	flow: FlowState;
	error: Error | null;
};

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Extract step names from a ModalSteps type
 * Useful for type-safe step name validation
 */
export type StepName<T extends ModalSteps> = keyof T;

/**
 * Type guard to check if a step is a transaction step
 */
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

/**
 * Type guard to check if a step is an approval step
 */
export function isApprovalStep(step: unknown): step is ApprovalStep {
	return (
		isTransactionStep(step) &&
		'reset' in step &&
		typeof (step as ApprovalStep).reset === 'function'
	);
}

/**
 * Type guard to check if a step is a fee step
 */
export function isFeeStep(step: unknown): step is FeeStep {
	return (
		typeof step === 'object' &&
		step !== null &&
		'isSponsored' in step &&
		'show' in step &&
		'cancel' in step
	);
}

/**
 * Type guard to check if a step is a form step
 */
export function isFormStep(step: unknown): step is FormStep {
	return (
		typeof step === 'object' &&
		step !== null &&
		'isValid' in step &&
		'errors' in step
	);
}
