import type { WebrpcError } from '../react/_internal/api/marketplace.gen';
import { isMarketplaceError } from './errors';
import { getWagmiErrorMessage } from './getWagmiErrorMessage';
import { getWebRPCErrorMessage } from './getWebRPCErrorMessage';

/**
 * Two-tier error API: Simple for basic usage, preserves error discrimination for advanced usage
 *
 * Tier 1 (Simple): Just get a user-friendly error message
 * ```typescript
 * const { error } = useSubmitTransaction();
 * if (error) {
 *   return <div>Error: {getErrorMessage(error)}</div>
 * }
 * ```
 *
 * Tier 2 (Advanced): Use error.name for discrimination
 * ```typescript
 * const { error } = useSubmitTransaction();
 * if (error?.name === 'InsufficientBalanceError') {
 *   // Handle specifically with rich error data
 * } else if (error?.name === 'UnauthorizedError') {
 *   // Redirect to login
 * }
 * ```
 */
export const getErrorMessage = (error: Error): string => {
	// Handle SDK-specific errors first
	if (isMarketplaceError(error)) {
		return error.message; // SDK errors already have user-friendly messages
	}

	// Check if it's a WebRPC error (has numeric code property)
	if ('code' in error && typeof (error as any).code === 'number') {
		return getWebRPCErrorMessage(error as WebrpcError);
	}

	// Otherwise, treat as Wagmi/blockchain error
	return getWagmiErrorMessage(error);
};
