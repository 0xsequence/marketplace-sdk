'use client';

import { createCard } from './CardFactory';
import type { CollectibleCardProps } from './types';

export function MarketplaceCollectibleCard(props: CollectibleCardProps) {
	return createCard(props);
}
