import { useQuery } from '@tanstack/react-query';
import { marketplaceConfigOptions } from '../../queries/marketplaceConfig';
import { useConfig } from '../config/useConfig';

/**
 * Fetches marketplace-specific configuration from the builder API
 *
 * This hook retrieves the marketplace configuration including project settings,
 * enabled features, collections, and marketplace pages (market and shop).
 * The data is cached indefinitely and won't refetch automatically.
 *
 * @returns React Query result containing the marketplace configuration
 * @returns returns.data - The marketplace configuration object when loaded
 * @returns returns.data.projectId - The numeric project ID
 * @returns returns.data.settings - General marketplace settings
 * @returns returns.data.market - Market page configuration with collections
 * @returns returns.data.shop - Shop page configuration with collections
 * @returns returns.isLoading - True while the configuration is being fetched
 * @returns returns.error - Error object if the fetch fails
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: marketplaceConfig, isLoading } = useMarketplaceConfig();
 *
 * if (isLoading) return <div>Loading marketplace...</div>;
 *
 * console.log('Project ID:', marketplaceConfig?.projectId);
 * console.log('Market enabled:', marketplaceConfig?.market.enabled);
 * ```
 *
 * @example
 * Using marketplace collections:
 * ```typescript
 * const { data: marketplaceConfig } = useMarketplaceConfig();
 *
 * // Access market collections
 * const marketCollections = marketplaceConfig?.market.collections || [];
 *
 * // Access shop collections
 * const shopCollections = marketplaceConfig?.shop.collections || [];
 *
 * // Check if market is enabled
 * if (marketplaceConfig?.market.enabled) {
 *   // Render market UI
 * }
 * ```
 *
 * @remarks
 * - This hook requires the MarketplaceSdkProvider context
 * - The configuration is fetched once and cached indefinitely (no automatic refetch)
 * - The builder API is called with the project ID from the SDK config
 * - Configuration can be overridden via SDK config's internal overrides
 *
 * @see {@link useConfig} - For accessing the base SDK configuration
 * @see {@link MarketplaceConfig} - The full type definition of the returned data
 */
export const useMarketplaceConfig = () => {
	const config = useConfig();
	return useQuery(marketplaceConfigOptions(config));
};
