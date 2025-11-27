import type { WebrpcError } from '@0xsequence/api-client';
import { isMarketplaceError } from './errors';
import { getWagmiErrorMessage, isWagmiError } from './getWagmiErrorMessage';
import { getWebRPCErrorMessage } from './getWebRPCErrorMessage';

/**
 * Type guard to check if an error is a WebRPC error
 */
function isWebrpcError(error: unknown): error is WebrpcError {
	return (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		typeof (error as { code: unknown }).code === 'number'
	);
}

export const getErrorMessage = (error: Error): string => {
	// Handle SDK-specific errors first
	if (isMarketplaceError(error)) {
		return error.message; // SDK errors already have user-friendly messages
	}

	// Check if it's a WebRPC error (has numeric code property)
	if (isWebrpcError(error)) {
		return getWebRPCErrorMessage(error);
	}

	if (isWagmiError(error)) {
		return getWagmiErrorMessage(error);
	}

	return (
		(error as Error)?.message ||
		'An unexpected error occurred. Please try again.'
	);
};
