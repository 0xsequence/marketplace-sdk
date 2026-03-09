import { MarketplaceKind, OrderbookKind } from '@0xsequence/api-client';

export function normalizeMarketplaceKind(
	kind: MarketplaceKind | undefined,
): MarketplaceKind | undefined {
	if (!kind) {
		return kind;
	}

	return kind === MarketplaceKind.magic_eden
		? MarketplaceKind.opensea
		: kind;
}

export function normalizeOrderbookKind(
	kind: OrderbookKind | undefined,
): OrderbookKind | undefined {
	if (!kind) {
		return kind;
	}

	return kind === OrderbookKind.magic_eden
		? OrderbookKind.opensea
		: kind;
}

export function isOpenSeaOrderbook(
	kind: OrderbookKind | undefined,
): boolean {
	return normalizeOrderbookKind(kind) === OrderbookKind.opensea;
}
