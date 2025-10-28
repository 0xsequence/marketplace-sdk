import type { WebrpcError } from '../react/_internal/api/marketplace.gen';
import { isMarketplaceError } from './errors';
import { getWagmiErrorMessage, isWagmiError } from './getWagmiErrorMessage';
import { getWebRPCErrorMessage } from './getWebRPCErrorMessage';

export const getErrorMessage = (error: Error): string => {
	// Handle SDK-specific errors first
	if (isMarketplaceError(error)) {
		return error.message; // SDK errors already have user-friendly messages
	}

	// Check if it's a WebRPC error (has numeric code property)
	if ('code' in error && typeof (error as any).code === 'number') {
		return getWebRPCErrorMessage(error as WebrpcError);
	}

	if (isWagmiError(error)) {
		return getWagmiErrorMessage(error);
	}

	return (
		(error as Error)?.message ||
		'An unexpected error occurred. Please try again.'
	);
};
