'use client';

import { Text } from '@0xsequence/design-system';
import type { ErrorAction } from '../actionModal/ActionModal';
import { BaseModal, type BaseModalProps } from './BaseModal';
import { SmartErrorHandler } from './SmartErrorHandler';

interface ErrorModalProps
	extends Pick<BaseModalProps, 'onClose' | 'title' | 'chainId'> {
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
export const ErrorModal = ({
	onClose,
	title,
	chainId,
	error,
	message,
	onRetry,
	onErrorAction,
}: ErrorModalProps) => (
	<BaseModal onClose={onClose} title={title} chainId={chainId}>
		<div
			className="flex items-center justify-center p-4"
			data-testid="error-modal"
		>
			{error ? (
				<SmartErrorHandler
					error={error}
					onDismiss={onClose}
					onAction={onErrorAction || (onRetry ? () => onRetry() : undefined)}
				/>
			) : (
				<Text className="font-body" color="text80">
					{message || 'Error loading item details'}
				</Text>
			)}
		</div>
	</BaseModal>
);
