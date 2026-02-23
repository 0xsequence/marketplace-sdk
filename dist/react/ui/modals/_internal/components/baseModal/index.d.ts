import "../../../../../../index2.js";
import { J as TransactionType } from "../../../../../../create-config.js";
import "../../../../../../xstate-store.cjs.js";
import "../../../../../../index3.js";
import { t as Button } from "../../../../../../index9.js";
import * as react14 from "react";
import React, { Component, ComponentProps, ErrorInfo, ReactNode } from "react";
import * as react_jsx_runtime26 from "react/jsx-runtime";
import { UseQueryResult } from "@tanstack/react-query";

//#region src/react/ui/modals/_internal/components/baseModal/BaseModal.d.ts
interface BaseModalProps {
  onClose: () => void;
  title: string;
  transactionType?: TransactionType;
  children: React.ReactNode;
  chainId: number;
  disableAnimation?: boolean;
}
/**
 * BaseModal - Simplified modal foundation without complex state management
 *
 * This component provides the basic modal structure without:
 * - isOpen prop (controlled by parent component conditional rendering)
 * - CTA system (handled by ActionModal or custom implementations)
 * - Error handling (can be composed separately)
 *
 * Use this when you need a simple modal shell with full control over content.
 */
declare const BaseModal: ({
  onClose,
  title,
  children,
  disableAnimation,
  transactionType
}: BaseModalProps) => react_jsx_runtime26.JSX.Element;
//#endregion
//#region src/react/ui/modals/_internal/components/baseModal/errors/errorActionType.d.ts
type ErrorAction = {
  type: 'retry' | 'topUp' | 'switchChain' | 'signIn' | 'custom';
  label: string;
  data?: unknown;
};
//#endregion
//#region src/react/ui/modals/_internal/components/baseModal/ActionModal.d.ts
type ActionModalType = 'listing' | 'offer' | 'sell' | 'buy' | 'transfer';
interface CtaAction {
  label: React.ReactNode;
  actionName?: string;
  onClick: (() => Promise<void>) | (() => void);
  loading?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  variant?: ComponentProps<typeof Button>['variant'];
  testid?: string;
}
interface ActionModalProps<T extends Record<string, UseQueryResult>> extends Omit<BaseModalProps, 'children'> {
  primaryAction?: CtaAction;
  secondaryAction?: CtaAction;
  additionalActions?: CtaAction[];
  type: ActionModalType;
  queries: T;
  children: (data: { [K in keyof T]: NonNullable<T[K]['data']> }, error?: Error, refetchFailedQueries?: () => Promise<void>) => React.ReactNode;
  externalError?: Error | null;
  onErrorDismiss?: () => void;
  onErrorAction?: (error: Error, action: ErrorAction) => void;
  errorComponent?: (error: Error) => React.ReactNode;
}
declare function ActionModal<T extends Record<string, UseQueryResult>>({
  children,
  chainId,
  type,
  primaryAction,
  secondaryAction,
  additionalActions,
  queries,
  externalError,
  onErrorDismiss,
  onErrorAction,
  errorComponent,
  ...baseProps
}: ActionModalProps<T>): react_jsx_runtime26.JSX.Element;
//#endregion
//#region src/react/ui/modals/_internal/components/baseModal/ErrorBoundary.d.ts
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onAction?: (error: Error, action: ErrorAction) => void;
  className?: string;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}
declare class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps);
  resetErrorBoundary: () => void;
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState>;
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
  render(): string | number | bigint | boolean | react_jsx_runtime26.JSX.Element | Iterable<ReactNode> | Promise<string | number | bigint | boolean | react14.ReactPortal | react14.ReactElement<unknown, string | react14.JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined;
}
//#endregion
//#region src/react/ui/modals/_internal/components/baseModal/ErrorModal.d.ts
interface ErrorModalProps extends Pick<BaseModalProps, 'onClose' | 'title' | 'chainId'> {
  error?: Error;
  message?: string;
  onRetry?: () => void;
  onErrorAction?: (error: Error, action: ErrorAction) => void;
}
/**
 * ErrorModal - Specialized modal for error states
 *
 * Improvements over the original wrapper:
 * - Built on BaseModal foundation
 * - Smart error handling integration
 * - Optional retry functionality
 * - Fallback to simple message display
 */
declare const ErrorModal: ({
  onClose,
  title,
  chainId,
  error,
  message,
  onRetry,
  onErrorAction
}: ErrorModalProps) => react_jsx_runtime26.JSX.Element;
//#endregion
//#region src/react/ui/modals/_internal/components/baseModal/LoadingModal.d.ts
interface LoadingModalProps extends Pick<BaseModalProps, 'onClose' | 'title' | 'chainId' | 'disableAnimation'> {
  message?: string;
}
declare const LoadingModal: ({
  onClose,
  title,
  chainId,
  disableAnimation,
  message
}: LoadingModalProps) => react_jsx_runtime26.JSX.Element;
//#endregion
export { ActionModal, type ActionModalProps, BaseModal, type BaseModalProps, type CtaAction, type ErrorAction, ErrorBoundary, ErrorModal, LoadingModal };
//# sourceMappingURL=index.d.ts.map