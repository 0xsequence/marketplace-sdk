import { Text } from '@0xsequence/design-system';
import { FilterBadges, useMarketplace } from 'shared-components';
import type { Address } from 'viem';
import { ContractType } from '../../../../sdk/src';
import {
	useCollection,
	useListPrimarySaleItems,
	useMarketplaceConfig,
} from '../../../../sdk/src/react';
import ERC721SaleControls from './components/ERC721SaleControls';
import { MarketContent } from './components/MarketContent';
import { ShopContent } from './components/ShopContent';

export function Collectibles() {
	const { chainId, paginationMode, marketplaceType, collectionAddress } =
		useMarketplace();
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const saleConfig = marketplaceConfig?.shop.collections.find(
		(c) => c.itemsAddress === collectionAddress,
	);
	const isShop = marketplaceType === 'shop';
	const saleContractAddress = saleConfig?.saleAddress as Address;

	const { data: primarySaleItems, isLoading: isLoadingPrimarySaleItems } =
		useListPrimarySaleItems({
			chainId,
			primarySaleContractAddress: saleContractAddress,
			enabled: isShop,
		});

	const saleItemIds =
		primarySaleItems?.primarySaleItems
			.map((item) => item.primarySaleItem.tokenId?.toString() ?? '')
			.filter(Boolean) ?? [];

	const { data: collection, isLoading: isLoadingCollection } = useCollection({
		collectionAddress,
		chainId,
		query: {
			enabled: isShop,
		},
	});
	const is721 = collection?.type === ContractType.ERC721;

	return (
		<div className="flex flex-col gap-4 pt-3">
			<div className="flex items-center justify-between">
				<Text variant="large">{isShop ? 'Shop' : 'Market'}</Text>

				<Text variant="small" color="text80">
					Mode:{' '}
					{paginationMode === 'paginated' ? 'Paginated' : 'Infinite Scroll'}
				</Text>
			</div>

			{isShop && is721 && (
				<ERC721SaleControls
					chainId={chainId}
					salesContractAddress={saleContractAddress}
					collectionAddress={collectionAddress}
					tokenIds={saleItemIds}
					isLoading={isLoadingCollection || isLoadingPrimarySaleItems}
				/>
			)}

			<FilterBadges />

			{marketplaceType === 'market' && <MarketContent />}
			{marketplaceType === 'shop' && saleContractAddress && saleItemIds && (
				<ShopContent
					saleContractAddress={saleContractAddress}
					saleItemIds={saleItemIds}
					collectionAddress={collectionAddress as Address}
					chainId={chainId}
					paginationMode={paginationMode}
				/>
			)}
		</div>
	);
}
