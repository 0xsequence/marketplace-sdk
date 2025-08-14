'use client';

import { useContext } from 'react';

import { MarketplaceSdkProviderNotFoundError } from '../../../utils/_internal/error/context';
import { MarketplaceSdkContext } from '../../providers';

/**
 * Retrieves the marketplace SDK configuration from the provider context
 *
 * This hook provides access to the core SDK configuration that was passed to
 * the MarketplaceSdkProvider. It includes API endpoints, chain configurations,
 * and other SDK-wide settings needed by child components and hooks.
 *
 * @returns The complete SDK configuration object from the provider context
 * @throws {MarketplaceSdkProviderNotFoundError} When used outside of MarketplaceSdkProvider
 *
 * @example
 * Basic usage:
 * ```typescript
 * const config = useConfig();
 * console.log(config.marketplaceApiUrl);
 * console.log(config.projectId);
 * ```
 *
 * @example
 * Using config for API calls:
 * ```typescript
 * const config = useConfig();
 * const response = await fetch(`${config.marketplaceApiUrl}/collections`, {
 *   headers: {
 *     'X-Project-ID': config.projectId
 *   }
 * });
 * ```
 *
 * @remarks
 * This hook must be used within a component wrapped by MarketplaceSdkProvider.
 * It's primarily used internally by other SDK hooks but can be accessed directly
 * when building custom marketplace functionality.
 *
 * @see {@link useMarketplaceConfig} - For marketplace-specific configuration
 * @see {@link MarketplaceSdkProvider} - The provider component that supplies this context
 */
export function useConfig() {
	const context = useContext(MarketplaceSdkContext);
	if (!context) {
		throw new MarketplaceSdkProviderNotFoundError();
	}
	return context;
}
