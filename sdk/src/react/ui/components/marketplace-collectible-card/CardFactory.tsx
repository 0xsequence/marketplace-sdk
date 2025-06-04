'use client';

import type { MarketplaceType } from '../../../../types';
import type { CollectibleCardProps } from './types';
import { MarketCard } from './variants/MarketCard';
import { ShopCard } from './variants/ShopCard';

export function createCard(props: CollectibleCardProps) {
	switch (props.marketplaceType) {
		case 'shop':
			return <ShopCard {...props} />;
		case 'market':
			return <MarketCard {...props} />;
		default: {
			const _exhaustiveCheck: never = props;
			throw new Error(
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				`Unknown marketplace type: ${(_exhaustiveCheck as any).marketplaceType}`,
			);
		}
	}
}

export function getCardComponent(marketplaceType: MarketplaceType) {
	switch (marketplaceType) {
		case 'shop':
			return ShopCard;
		case 'market':
			return MarketCard;
		default:
			throw new Error(`Unknown marketplace type: ${marketplaceType}`);
	}
}
