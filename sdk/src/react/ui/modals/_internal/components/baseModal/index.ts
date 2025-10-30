// New improved modal architecture

export {
	ActionModal,
	type ActionModalProps,
	type CtaAction,
} from './ActionModal';
export { BaseModal, type BaseModalProps } from './BaseModal';
export { ErrorBoundary } from './ErrorBoundary';
export { ErrorModal } from './ErrorModal';
// Re-export error types for convenience
export type { ErrorAction } from './errors/errorActionType';
export { LoadingModal } from './LoadingModal';
