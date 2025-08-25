'use client';

import type { ContractType } from '../../../../_internal';
import { BaseCard } from '../components/BaseCard';
import { NonTradableInventoryFooter } from '../components/footer';
import type { NonTradableInventoryCardProps } from '../types';

export function NonTradableInventoryCard({
	collectibleId,
	chainId,
	collectionAddress,
	collectionType,
	assetSrcPrefixUrl,
	cardLoading,
	balance,
	balanceIsLoading,
	collectibleMetadata,
}: NonTradableInventoryCardProps) {
	return (
		<BaseCard
			collectibleId={collectibleId}
			image={collectibleMetadata.image}
			video={collectibleMetadata.video}
			animationUrl={collectibleMetadata.animation_url}
			chainId={chainId}
			collectionAddress={collectionAddress}
			collectionType={collectionType}
			assetSrcPrefixUrl={assetSrcPrefixUrl}
			cardLoading={cardLoading || balanceIsLoading}
			name={collectibleMetadata.name}
		>
			<NonTradableInventoryFooter
				name={collectibleMetadata.name || ''}
				type={collectionType as ContractType}
				balance={balance}
				decimals={collectibleMetadata.decimals}
			/>
		</BaseCard>
	);
}
