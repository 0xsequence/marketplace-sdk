import { MarketplaceKind, OrderbookKind } from './marketplace.gen';

export function normalizeMarketplaceKind(
	kind: MarketplaceKind,
): MarketplaceKind {
	return kind === MarketplaceKind.magic_eden
		? MarketplaceKind.opensea
		: kind;
}

export function normalizeOrderbookKind(kind: OrderbookKind): OrderbookKind {
	return kind === OrderbookKind.magic_eden
		? OrderbookKind.opensea
		: kind;
}
