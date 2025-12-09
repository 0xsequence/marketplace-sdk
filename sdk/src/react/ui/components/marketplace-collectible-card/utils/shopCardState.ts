import type { Address } from 'viem';
import { ContractType } from '../../../../_internal';

export interface ShopCardStateParams {
	quantityRemaining?: bigint;
	quantityInitial?: bigint;
	unlimitedSupply?: boolean;
	collectionType?: ContractType;
	salesContractAddress?: Address;
}

export interface ShopCardState {
	isOutOfStock: boolean;
	isMissingStockInfo: boolean;
	showActionButton: boolean;
	mediaClassName: string;
	titleClassName: string | undefined;
}

/**
 * Calculates the display state for a shop card based on stock availability
 *
 * @param params - Stock and collection parameters
 * @returns Computed state for visual styling and interaction
 *
 * @example
 * ```tsx
 * const shopState = getShopCardState({
 *   quantityRemaining: '5',
 *   quantityInitial: '100',
 *   unlimitedSupply: false,
 *   collectionType: ContractType.ERC1155,
 *   salesContractAddress: '0x...'
 * });
 *
 * // Use computed state
 * <Card.Media className={shopState.mediaClassName} />
 * <Card.Title className={shopState.titleClassName} />
 * <Card.Actions show={shopState.showActionButton} />
 * ```
 */
export function getShopCardState(params: ShopCardStateParams): ShopCardState {
	const {
		quantityRemaining,
		quantityInitial,
		unlimitedSupply,
		collectionType,
		salesContractAddress,
	} = params;

	// Check if item is out of stock
	const isOutOfStock =
		!unlimitedSupply &&
		(quantityRemaining === 0n || quantityRemaining === undefined);

	// Check if stock information is missing
	const isMissingStockInfo =
		quantityInitial === undefined || quantityRemaining === undefined;

	// Show action button only if:
	// 1. Sales contract exists
	// 2. Collection is ERC1155
	// 3. Either unlimited supply OR has remaining quantity
	const showActionButton =
		!!salesContractAddress &&
		collectionType === ContractType.ERC1155 &&
		(unlimitedSupply ||
			(quantityRemaining !== undefined && quantityRemaining > 0n));

	// Styling for out of stock items
	const mediaClassName = isOutOfStock ? 'opacity-50' : 'opacity-100';

	// Styling for items with missing stock info
	const titleClassName = isMissingStockInfo ? 'text-text-50' : undefined;

	return {
		isOutOfStock,
		isMissingStockInfo,
		showActionButton,
		mediaClassName,
		titleClassName,
	};
}
