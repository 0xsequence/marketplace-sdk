'use client';

import { CollectibleCardAction } from '../../../../../types';
import { ContractType } from '../../../../_internal';
import { useCurrency } from '../../../../hooks/data/market/useCurrency';
import { ActionButtonWrapper } from '../components/ActionButtonWrapper';
import { BaseCard } from '../components/BaseCard';
import { Footer } from '../Footer';
import type { ShopCollectibleCardProps } from '../types';

export function ShopCard({
	collectibleId,
	chainId,
	collectionAddress,
	collectionType,
	assetSrcPrefixUrl,
	cardLoading,
	marketplaceType,
	salesContractAddress,
	tokenMetadata,
	salePrice,
	quantityDecimals,
	quantityInitial,
	quantityRemaining,
	unlimitedSupply,
}: ShopCollectibleCardProps) {
	const { data: saleCurrency, isLoading: saleCurrencyLoading } = useCurrency({
		chainId,
		currencyAddress: salePrice?.currencyAddress,
		query: {
			enabled:
				!!salePrice?.currencyAddress &&
				!!salesContractAddress &&
				collectionType === ContractType.ERC1155,
		},
	});

	const isLoading = cardLoading || saleCurrencyLoading;

	if (!tokenMetadata || !salePrice) {
		console.error('Token metadata or sale price is undefined', {
			tokenMetadata,
			salePrice,
		});
		return null;
	}

	const showActionButton =
		salesContractAddress &&
		collectionType === ContractType.ERC1155 &&
		(unlimitedSupply ||
			(quantityRemaining !== undefined && Number(quantityRemaining) > 0));

	const action = CollectibleCardAction.BUY;

	const mediaClassName = !quantityRemaining ? 'opacity-50' : 'opacity-100';

	return (
		<BaseCard
			collectibleId={collectibleId}
			chainId={chainId}
			collectionAddress={collectionAddress}
			collectionType={collectionType}
			assetSrcPrefixUrl={assetSrcPrefixUrl}
			cardLoading={cardLoading}
			marketplaceType={marketplaceType}
			isLoading={isLoading}
			name={tokenMetadata.name || ''}
			image={tokenMetadata.image}
			video={tokenMetadata.video}
			animationUrl={tokenMetadata.animation_url}
			className={mediaClassName}
		>
			<Footer
				name={tokenMetadata.name || ''}
				type={collectionType}
				decimals={tokenMetadata.decimals}
				quantityInitial={quantityInitial}
				quantityRemaining={quantityRemaining}
				unlimitedSupply={unlimitedSupply}
				marketplaceType={marketplaceType}
				salePriceAmount={salePrice?.amount}
				salePriceCurrency={saleCurrency}
			/>

			<ActionButtonWrapper
				show={showActionButton}
				chainId={chainId}
				collectionAddress={collectionAddress}
				tokenId={collectibleId}
				action={action}
				owned={false}
				marketplaceType={marketplaceType}
				salesContractAddress={salesContractAddress}
				salePrice={salePrice}
				quantityDecimals={quantityDecimals}
				quantityRemaining={
					quantityRemaining !== undefined
						? Number(quantityRemaining)
						: undefined
				}
				unlimitedSupply={unlimitedSupply}
			/>
		</BaseCard>
	);
}
