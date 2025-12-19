/**
 * Type-level assertions to ensure identical types across different packages
 *
 * This file validates that enums/types that SHOULD be identical (like PropertyType
 * from metadata vs marketplace) are actually structurally identical at compile time.
 *
 * ## Why This Matters
 *
 * The api-client package receives types from multiple @0xsequence packages:
 * - @0xsequence/indexer
 * - @0xsequence/metadata
 * - @0xsequence/marketplace (internal gen)
 *
 * Some enums appear in multiple packages (e.g., PropertyType exists in both metadata
 * and marketplace). To avoid confusion and duplicate exports, we:
 *
 * 1. Export ONE canonical version from marketplace-api
 * 2. Use these type assertions to VERIFY at compile time that they're identical
 * 3. If the upstream packages diverge, TypeScript will error here
 *
 * This gives us confidence that exporting `PropertyType` from marketplace is safe
 * and equivalent to exporting it from metadata.
 *
 * ## How It Works
 *
 * The `AssertIdentical` type uses conditional types to verify bidirectional
 * compatibility. If the assertion fails, you'll get a compile error like:
 *
 * ```
 * Type 'true' is not assignable to type 'never'
 * ```
 *
 * This means the two enums have diverged and need investigation.
 */

// Type-level assertion that two types are identical
type AssertIdentical<T, U> = [T] extends [U]
	? [U] extends [T]
		? true
		: never
	: never;

import type { ResourceStatus as IndexerResourceStatus } from '@0xsequence/indexer';
import type {
	PropertyType as MetadataPropertyType,
	ResourceStatus as MetadataResourceStatus,
} from '@0xsequence/metadata';
import type { PropertyType as MarketplacePropertyType } from '../adapters/marketplace/marketplace.gen';

/**
 * PropertyType - Should be identical across metadata and marketplace
 * Values: INT, STRING, ARRAY, GENERIC
 */
const _assertPropertyTypeMatch: AssertIdentical<
	typeof MarketplacePropertyType,
	typeof MetadataPropertyType
> = true;

/**
 * ContractType - Different across packages
 *
 * ContractType exists in multiple packages with different structures:
 * - @0xsequence/indexer: Most comprehensive (includes NATIVE, SEQUENCE_WALLET, BRIDGE types, etc.)
 * - @0xsequence/metadata: Limited set (UNKNOWN, ERC20, ERC721, ERC1155, ERC6909, MISC)
 * - marketplace.gen.ts: Limited set (UNKNOWN, ERC20, ERC721, ERC1155)
 *
 * We export ContractType from @0xsequence/indexer in the main index.ts as it's the most
 * general and includes all the values from the other packages. This ensures consumers
 * always get the same type and prevents type conflicts (ContractType$1, ContractType$2, etc).
 */

/**
 * ResourceStatus - Should be identical across indexer and metadata
 * Values vary by package but should be structurally identical
 */
const _assertResourceStatusMatch: AssertIdentical<
	typeof IndexerResourceStatus,
	typeof MetadataResourceStatus
> = true;

// Silence "declared but never used" warnings
export const TYPE_ASSERTIONS = {
	propertyType: _assertPropertyTypeMatch,
	resourceStatus: _assertResourceStatusMatch,
} as const;
