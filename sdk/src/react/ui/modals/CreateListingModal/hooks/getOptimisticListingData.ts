import type { Address } from 'viem';
import {
	type Currency,
	type ListingInput,
	type MarketplaceKind,
	type Order,
	type OrderbookKind,
	OrderSide,
	OrderStatus,
} from '../../../../_internal';

export function getOptimisticListingData(params: {
	orderbookKind: OrderbookKind;
	chainId: number;
	collectionAddress: Address;
	address: Address;
	currency: Currency;
	listingInput: ListingInput;
}) {
	const optimisticListingData: Order = {
		orderId: params.orderbookKind || `temp-${Date.now()}`, // Use real orderId if available, otherwise temporary ID,
		marketplace: params.orderbookKind as unknown as MarketplaceKind,
		side: OrderSide.listing,
		status: OrderStatus.active,
		chainId: params.chainId,
		originName: 'Sequence', // Default origin name
		collectionContractAddress: params.collectionAddress,
		tokenId: params.listingInput.listing.tokenId,
		createdBy: params.address || '', // User making the listing
		priceAmount: params.listingInput.listing.pricePerToken,
		priceAmountFormatted: params.currency
			? (
					Number(params.listingInput.listing.pricePerToken) /
					10 ** params.currency.decimals
				).toString()
			: params.listingInput.listing.pricePerToken,
		priceAmountNet: params.listingInput.listing.pricePerToken, // Simplified for optimistic update
		priceAmountNetFormatted: params.currency
			? (
					Number(params.listingInput.listing.pricePerToken) /
					10 ** params.currency.decimals
				).toString()
			: params.listingInput.listing.pricePerToken,
		priceCurrencyAddress: params.listingInput.listing.currencyAddress,
		priceDecimals: params.currency?.decimals || 18,
		priceUSD: 0, // We don't have USD price for optimistic update
		priceUSDFormatted: '0',
		quantityInitial: params.listingInput.listing.quantity,
		quantityInitialFormatted: params.listingInput.listing.quantity,
		quantityRemaining: params.listingInput.listing.quantity,
		quantityRemainingFormatted: params.listingInput.listing.quantity,
		quantityAvailable: params.listingInput.listing.quantity,
		quantityAvailableFormatted: params.listingInput.listing.quantity,
		quantityDecimals: 0,
		feeBps: 0, // Default fee
		feeBreakdown: [],
		validFrom: new Date().toISOString(),
		validUntil: new Date(
			Number(params.listingInput.listing.expiry) * 1000,
		).toISOString(),
		blockNumber: 0, // Will be filled when transaction is mined
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};
	return optimisticListingData;
}
