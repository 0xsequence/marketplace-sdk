'use client';

import type {
	ChainMismatchError,
	InsufficientBalanceError,
	UserRejectedError,
} from '../../../../../../utils/errors';
import { getErrorMessage } from '../../../../../../utils/getErrorMessage';
import { ErrorDisplay } from '../../../../components/_internals/ErrorDisplay';
import { ChainMismatchErrorComponent } from './errors/ChainMismatchError';
import type { ErrorAction } from './errors/errorActionType';
import { InsufficientBalanceErrorComponent } from './errors/InsufficientBalanceError';
import { UserRejectedErrorComponent } from './errors/UserRejectedError';

interface SmartErrorHandlerProps {
	error: Error;
	onDismiss?: () => void;
	onAction?: (error: Error, action: ErrorAction) => void;
	customComponent?: (error: Error) => React.ReactNode;
}

export const SmartErrorHandler = ({
	error,
	onDismiss,
	onAction,
	customComponent,
}: SmartErrorHandlerProps) => {
	// Progressive enhancement - custom error component takes precedence
	if (customComponent) {
		return <>{customComponent(error)}</>;
	}

	// Smart error discrimination based on error name/type
	switch (error.name) {
		case 'InsufficientBalanceError':
			return (
				<InsufficientBalanceErrorComponent
					error={error as InsufficientBalanceError}
					onTopUp={() =>
						onAction?.(error, { type: 'topUp', label: 'Add Funds' })
					}
					onDismiss={onDismiss}
				/>
			);

		case 'UserRejectedError':
			return (
				<UserRejectedErrorComponent
					error={error as UserRejectedError}
					onRetry={() =>
						onAction?.(error, { type: 'retry', label: 'Try Again' })
					}
					onDismiss={onDismiss}
				/>
			);

		case 'ChainMismatchError':
			return (
				<ChainMismatchErrorComponent
					error={error as ChainMismatchError}
					onSwitchChain={() =>
						onAction?.(error, { type: 'switchChain', label: 'Switch Chain' })
					}
					onDismiss={onDismiss}
				/>
			);

		default:
			// Default beautiful error display for all other errors
			return (
				<ErrorDisplay
					title="Transaction Error"
					message={getErrorMessage(error)}
					error={error}
					onDismiss={onDismiss}
				/>
			);
	}
};
