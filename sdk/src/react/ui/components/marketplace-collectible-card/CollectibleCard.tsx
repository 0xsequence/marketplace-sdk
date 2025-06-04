'use client';

import type { CollectibleCardProps } from './types';
import { MarketCard } from './variants/MarketCard';

import { ShopCard } from './variants/ShopCard';

export function CollectibleCard(props: CollectibleCardProps) {
	switch (props.marketplaceType) {
		case 'shop':
			return <ShopCard {...props} />;
		// biome-ignore lint/complexity/noUselessSwitchCase: <explanation>
		case 'market':
		default:
			return <MarketCard {...props} />;
	}
}
