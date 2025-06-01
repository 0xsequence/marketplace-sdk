import { Text } from '@0xsequence/design-system';
import { FilterBadges, useMarketplace } from 'shared-components';
import type { Address } from 'viem';
import { ContractType } from '../../../../sdk/src';
import { useCollection } from '../../../../sdk/src/react';
import { MarketContent } from './components/MarketContent';
import PrimarySaleControls from './components/PrimarySaleControls';
import { ShopContent } from './components/ShopContent';

export function Collectibles() {
	const {
		chainId,
		paginationMode,
		marketplaceType,
		collectionAddress,
		sdkConfig,
	} = useMarketplace();
	const saleConfig = sdkConfig.tmpShopConfig?.collections.find(
		(c) => c.address === collectionAddress,
	);
	const isShop = marketplaceType === 'shop';
	const saleContractAddress =
		saleConfig?.primarySalesContractAddress as Address;
	const { data: collection } = useCollection({
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

			{isShop && is721 && saleContractAddress && (
				<PrimarySaleControls
					chainId={chainId}
					salesContractAddress={saleContractAddress}
					collectionAddress={collectionAddress}
				/>
			)}

			<FilterBadges />

			{marketplaceType === 'market' && <MarketContent />}
			{marketplaceType === 'shop' && saleContractAddress && (
				<ShopContent
					saleContractAddress={saleContractAddress}
					collectionAddress={collectionAddress as Address}
					chainId={chainId}
					paginationMode={paginationMode}
				/>
			)}
		</div>
	);
}
