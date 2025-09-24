import type { Address } from 'viem';
import type { Currency } from '../../../../../types';
import {
	type MarketplaceKind,
	type Order,
	type OrderbookKind,
	OrderSide,
	OrderStatus,
} from '../../../../_internal';
import type { OfferInput } from '../../../../_internal/types';

export function getOptimisticOfferData(params: {
	orderbookKind: OrderbookKind;
	chainId: number;
	collectionAddress: Address;
	address: Address;
	currency: Currency;
	offerInput: OfferInput;
}) {
	const optimisticOfferData: Order = {
		orderId: `temp-${Date.now()}`,
		marketplace: params.orderbookKind as unknown as MarketplaceKind,
		side: OrderSide.offer,
		status: OrderStatus.active,
		chainId: params.chainId,
		originName: 'Sequence',
		collectionContractAddress: params.collectionAddress,
		tokenId: params.offerInput.offer.tokenId,
		createdBy: params.address || '',
		priceAmount: params.offerInput.offer.pricePerToken,
		priceAmountFormatted: params.currency
			? (
					Number(params.offerInput.offer.pricePerToken) /
					10 ** params.currency.decimals
				).toString()
			: params.offerInput.offer.pricePerToken,
		priceAmountNet: params.offerInput.offer.pricePerToken,
		priceAmountNetFormatted: params.currency
			? (
					Number(params.offerInput.offer.pricePerToken) /
					10 ** params.currency.decimals
				).toString()
			: params.offerInput.offer.pricePerToken,
		priceCurrencyAddress: params.offerInput.offer.currencyAddress,
		priceDecimals: params.currency?.decimals || 18,
		priceUSD: 0,
		priceUSDFormatted: '0',
		quantityInitial: params.offerInput.offer.quantity,
		quantityInitialFormatted: params.offerInput.offer.quantity,
		quantityRemaining: params.offerInput.offer.quantity,
		quantityRemainingFormatted: params.offerInput.offer.quantity,
		quantityAvailable: params.offerInput.offer.quantity,
		quantityAvailableFormatted: params.offerInput.offer.quantity,
		quantityDecimals: 0,
		feeBps: 0,
		feeBreakdown: [],
		validFrom: new Date().toISOString(),
		validUntil: new Date(
			Number(params.offerInput.offer.expiry) * 1000,
		).toISOString(),
		blockNumber: 0,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	return optimisticOfferData;
}
