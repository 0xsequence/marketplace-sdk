'use client';

import type { CollectibleCardProps } from './types';
import { MarketCard } from './variants/MarketCard';
import { NonTradableInventoryCard } from './variants/NonTradableInventoryCard';

import { ShopCard } from './variants/ShopCard';

export function CollectibleCard(props: CollectibleCardProps) {
	switch (props.cardType) {
		case 'shop':
			return <ShopCard {...props} />;
		case 'market':
			return <MarketCard {...props} />;
		case 'inventory-non-tradable':
			return <NonTradableInventoryCard {...props} />;
	}
}
