'use client';

import { getErrorMessage } from '../../../../../../utils/getErrorMessage';
import { ErrorDisplay } from '../../../../components/_internals/ErrorDisplay';
import type { ErrorAction } from './errors/errorActionType';

interface SmartErrorHandlerProps {
	error: Error;
	onHide?: () => void;
	onAction?: (error: Error, action: ErrorAction) => void;
	customComponent?: (error: Error) => React.ReactNode;
}

export const SmartErrorHandler = ({
	error,
	onHide,
	customComponent,
}: SmartErrorHandlerProps) => {
	if (customComponent) {
		return <>{customComponent(error)}</>;
	}

	return (
		<ErrorDisplay
			title={error.name || 'Transaction Error'}
			message={getErrorMessage(error)}
			error={error}
			onHide={onHide}
		/>
	);
};
