'use client';

import React, { useContext } from 'react';
import { SmartErrorHandler } from '../baseModal/SmartErrorHandler';

// We'll define this context union type for the universal error handler
type ModalContextUnion = {
	error?: Error | null;
	handleErrorDismiss: () => void;
	handleErrorAction: (error: Error, action: any) => void;
} | null;

/**
 * Universal error component that works with any modal context
 * Automatically detects and handles errors from any modal provider
 */
export function UniversalError() {
	// Try to get context from any of the modal contexts
	// This is a bit of a hack, but it allows the error component to work universally
	const context = useContext(React.createContext<ModalContextUnion>(null));

	if (!context?.error) return null;

	return (
		<SmartErrorHandler
			error={context.error}
			onDismiss={context.handleErrorDismiss}
			onAction={context.handleErrorAction}
		/>
	);
}

/**
 * Universal error component that accepts explicit props
 * Use this when you want to pass error handling explicitly
 */
export function UniversalErrorExplicit({
	error,
	onDismiss,
	onAction,
}: {
	error?: Error | null;
	onDismiss?: () => void;
	onAction?: (error: Error, action: any) => void;
}) {
	if (!error) return null;

	return (
		<SmartErrorHandler
			error={error}
			onDismiss={onDismiss}
			onAction={onAction}
		/>
	);
}
