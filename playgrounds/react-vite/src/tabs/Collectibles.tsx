import { Text } from '@0xsequence/design-system';
import { FilterBadges, useMarketplace } from 'shared-components';
import type { Address } from 'viem';
import { MarketContent } from './components/MarketContent';
import { ShopContent } from './components/ShopContent';

export function Collectibles() {
	const {
		chainId,
		paginationMode,
		marketplaceType,
		collectionAddress,
		sdkConfig,
	} = useMarketplace();
	const saleConfig = sdkConfig.tmpShopConfig.collections.find(
		(c) => c.address === collectionAddress,
	);

	const saleContractAddress =
		saleConfig?.primarySalesContractAddress as Address;
	const saleItemIds = saleConfig?.tokenIds;

	return (
		<div className="flex flex-col gap-4 pt-3">
			<div className="flex items-center justify-between">
				<Text variant="large">Market</Text>

				<Text variant="small" color="text80">
					Mode:{' '}
					{paginationMode === 'paginated' ? 'Paginated' : 'Infinite Scroll'}
				</Text>
			</div>

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
