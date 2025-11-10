'use client';

import { forwardRef } from 'react';
import type { ContractType } from '../../../../_internal';
import { Card } from '../Card';
import type { NonTradableInventoryCardProps } from '../types';
import { renderSkeletonIfLoading } from '../utils';

export const NonTradableInventoryCard = forwardRef<
	HTMLDivElement,
	NonTradableInventoryCardProps
>(
	(
		{
			collectionType,
			assetSrcPrefixUrl,
			cardLoading,
			balance,
			balanceIsLoading,
			collectibleMetadata,
		},
		ref,
	) => {
		// Show loading skeleton
		const skeleton = renderSkeletonIfLoading({
			cardLoading,
			balanceIsLoading,
			collectionType,
			isShop: false,
		});
		if (skeleton) return skeleton;

		return (
			<Card ref={ref}>
				<Card.Media
					metadata={collectibleMetadata}
					assetSrcPrefixUrl={assetSrcPrefixUrl}
				/>

				<Card.Content>
					<Card.Title>{collectibleMetadata.name || 'Untitled'}</Card.Title>

					<Card.Price />

					<Card.Badge
						type={collectionType as ContractType}
						balance={balance}
						decimals={collectibleMetadata.decimals}
					/>
				</Card.Content>
			</Card>
		);
	},
);

NonTradableInventoryCard.displayName = 'NonTradableInventoryCard';
