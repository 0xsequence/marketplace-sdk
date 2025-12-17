import { useLocation, useNavigate, useParams } from 'react-router';
import {
	CollectiblesPageController,
	createRoute,
	ERC721SaleControls,
} from 'shared-components';
import type { Address } from 'viem';

export function Collectibles() {
	const navigate = useNavigate();
	const location = useLocation();
	const { collectionAddress, chainId, salesAddress, itemAddress } = useParams<{
		collectionAddress?: Address;
		salesAddress?: Address;
		itemAddress?: Address;
		chainId: string;
	}>();

	const isShop = location.pathname.startsWith('/shop');

	const handleCollectibleClick = (tokenId: bigint) => {
		if (isShop && salesAddress && itemAddress) {
			const route = createRoute.shopCollectible(
				Number(chainId),
				salesAddress,
				itemAddress,
				tokenId,
			);
			navigate(route);
		} else if (collectionAddress) {
			const route = createRoute.marketCollectible(
				Number(chainId),
				collectionAddress,
				tokenId,
			);
			navigate(route);
		}
	};

	const renderSaleControls = ({
		chainId,
		salesContractAddress,
		collectionAddress,
		tokenIds,
		isLoading,
		salePrice,
	}: {
		chainId: number;
		salesContractAddress: Address;
		collectionAddress: Address;
		tokenIds: bigint[];
		isLoading: boolean;
		salePrice?: {
			amount?: bigint;
			currencyAddress?: Address;
		};
	}) => (
		<ERC721SaleControls
			chainId={chainId}
			salesContractAddress={salesContractAddress}
			collectionAddress={collectionAddress}
			tokenIds={tokenIds}
			isLoading={isLoading}
			salePrice={salePrice}
		/>
	);

	return (
		<CollectiblesPageController
			onCollectibleClick={handleCollectibleClick}
			renderSaleControls={renderSaleControls}
			showMarketTypeToggle={false}
			showFilters={true}
			showSaleControls={isShop}
			collectionAddress={(isShop ? itemAddress : collectionAddress) as Address}
			salesAddress={isShop ? (salesAddress as Address) : undefined}
			chainId={Number(chainId)}
			cardType={isShop ? 'shop' : 'market'}
		/>
	);
}
