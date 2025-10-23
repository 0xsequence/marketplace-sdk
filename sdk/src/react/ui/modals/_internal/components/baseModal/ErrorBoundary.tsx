'use client';

import type { ErrorAction } from '../actionModal/ActionModal';
import { SmartErrorHandler } from '../actionModal/SmartErrorHandler';

interface ErrorBoundaryProps {
	error?: Error | null;
	onDismiss?: () => void;
	onAction?: (error: Error, action: ErrorAction) => void;
	customComponent?: (error: Error) => React.ReactNode;
	className?: string;
}

/**
 * ErrorBoundary - Standalone error handling component
 *
 * Can be used anywhere in the app, not just in modals.
 * Provides consistent error handling and UX across the application.
 */
export const ErrorBoundary = ({
	error,
	onDismiss,
	onAction,
	customComponent,
	className,
}: ErrorBoundaryProps) => {
	if (!error) return null;

	return (
		<div className={className} data-testid="error-boundary">
			<SmartErrorHandler
				error={error}
				onDismiss={onDismiss}
				onAction={onAction}
				customComponent={customComponent}
			/>
		</div>
	);
};
