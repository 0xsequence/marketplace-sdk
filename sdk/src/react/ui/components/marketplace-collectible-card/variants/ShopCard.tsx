'use client';

import { type CardType, CollectibleCardAction } from '../../../../../types';
import { ContractType } from '../../../../_internal';
import { useCurrency } from '../../../../hooks/data/market/useCurrency';
import { ActionButtonWrapper } from '../components/ActionButtonWrapper';
import { BaseCard } from '../components/BaseCard';
import { Footer } from '../components/footer';
import type { ShopCollectibleCardProps } from '../types';

export function ShopCard({
	collectibleId,
	chainId,
	collectionAddress,
	collectionType,
	assetSrcPrefixUrl,
	cardLoading,
	cardType,
	salesContractAddress,
	tokenMetadata,
	salePrice,
	quantityDecimals,
	quantityInitial,
	quantityRemaining,
	unlimitedSupply,
	hideQuantitySelector,
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

	const mediaClassName = unlimitedSupply
		? 'opacity-100'
		: quantityRemaining === '0' || quantityRemaining === undefined
			? 'opacity-50'
			: 'opacity-100';

	return (
		<BaseCard
			collectibleId={collectibleId}
			chainId={chainId}
			collectionAddress={collectionAddress}
			collectionType={collectionType}
			assetSrcPrefixUrl={assetSrcPrefixUrl}
			cardLoading={cardLoading || saleCurrencyLoading}
			cardType={cardType}
			name={tokenMetadata.name || ''}
			image={tokenMetadata.image}
			video={tokenMetadata.video}
			animationUrl={tokenMetadata.animation_url}
			mediaClassName={mediaClassName}
			contractType={collectionType as ContractType}
			isShop={true}
			hideQuantitySelector={hideQuantitySelector}
		>
			<Footer
				chainId={chainId}
				collectionAddress={collectionAddress}
				collectibleId={collectibleId}
				name={tokenMetadata.name || ''}
				type={collectionType}
				decimals={tokenMetadata.decimals}
				quantityInitial={quantityInitial}
				quantityRemaining={quantityRemaining}
				unlimitedSupply={unlimitedSupply}
				cardType={cardType as CardType}
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
				cardType={cardType as CardType}
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
