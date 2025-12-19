import type { ContractType } from '@0xsequence/api-client';
import { Card } from '../Card';

/**
 * Determines whether to render a skeleton loading state for a card
 * and returns the skeleton component if appropriate.
 *
 * @param params - Loading state parameters
 * @param params.cardLoading - Whether the card data is loading
 * @param params.balanceIsLoading - Whether the balance data is loading (optional)
 * @param params.collectionType - Type of collection (ERC721/ERC1155)
 * @param params.isShop - Whether this is a shop card variant
 * @returns Skeleton component if loading, null otherwise
 *
 * @example
 * ```tsx
 * const skeleton = renderSkeletonIfLoading({
 *   cardLoading,
 *   balanceIsLoading,
 *   collectionType,
 *   isShop: false
 * });
 * if (skeleton) return skeleton;
 * ```
 */
export function renderSkeletonIfLoading(params: {
	cardLoading: boolean;
	balanceIsLoading?: boolean;
	collectionType: ContractType | undefined;
	isShop: boolean;
}): React.ReactElement | null {
	const {
		cardLoading,
		balanceIsLoading = false,
		collectionType,
		isShop,
	} = params;

	if (cardLoading || balanceIsLoading) {
		return <Card.Skeleton type={collectionType} isShop={isShop} />;
	}

	return null;
}
