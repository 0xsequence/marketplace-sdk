/**
 * Marketplace API Transformations
 *
 * This file previously contained transform functions to convert between raw API types
 * and normalized types. However, since we now re-export gen types directly as our
 * normalized types (via api-types.ts and types.ts), these transforms are no longer needed.
 *
 * The types are already normalized at the API level:
 * - chainId is number (not string)
 * - tokenId is bigint (not string)
 * - All enum fields use proper TypeScript enums
 *
 * If you need to transform chainId between number and string for specific API calls,
 * use the client.ts wrapper which handles this conversion.
 */

/**
 * All transform functions have been removed as they are no longer needed.
 *
 * Previously this file had:
 * - toCollection()
 * - toCollectible()
 * - toOrder()
 * - toCurrency()
 * - toCollectibleOrder()
 * - toGetCollectibleRequest()
 * - toGetCollectionRequest()
 * - toCollectiblesFilter()
 * - toOrdersFilter()
 *
 * These were converting between identical types (gen → gen) since both
 * api-types.ts and types.ts now re-export from marketplace.gen.ts.
 */
