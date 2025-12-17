'use client';

import type { ContractType } from '@0xsequence/api-client';
import { forwardRef } from 'react';
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
			classNames,
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
			<Card ref={ref} className={classNames?.cardRoot}>
				<Card.Media
					metadata={collectibleMetadata}
					assetSrcPrefixUrl={assetSrcPrefixUrl}
					className={classNames?.cardMedia}
				/>

				<Card.Content className={classNames?.cardContent}>
					<Card.Title className={classNames?.cardTitle}>
						{collectibleMetadata.name || 'Untitled'}
					</Card.Title>

					<Card.Price className={classNames?.cardPrice} type={'market'} />

					<Card.Badge
						type={collectionType as ContractType}
						balance={balance}
						className={classNames?.cardBadge}
					/>
				</Card.Content>
			</Card>
		);
	},
);

NonTradableInventoryCard.displayName = 'NonTradableInventoryCard';
