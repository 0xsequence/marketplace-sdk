// New improved modal architecture

// Re-export error types for convenience
export type { ErrorAction } from '../actionModal/ActionModal';
export {
	ActionModal,
	type ActionModalProps,
	type CtaAction,
} from './ActionModal';
export { BaseModal, type BaseModalProps } from './BaseModal';
export { ErrorBoundary } from './ErrorBoundary';
export { ErrorModal } from './ErrorModal';
export { LoadingModal } from './LoadingModal';
