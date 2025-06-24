import { useNavigate } from 'react-router';
import { CollectiblesPageController, ERC721SaleControls, ROUTES } from 'shared-components';
import type { Address } from 'viem';

export function Collectibles() {
	const navigate = useNavigate();

	const handleCollectibleClick = (_tokenId: string) => {
		navigate(`/${ROUTES.COLLECTIBLE.path}`);
	};

	const renderSaleControls = ({
		chainId,
		salesContractAddress,
		collectionAddress,
		tokenIds,
		isLoading,
	}: {
		chainId: number;
		salesContractAddress: Address;
		collectionAddress: Address;
		tokenIds: string[];
		isLoading: boolean;
	}) => (
		<ERC721SaleControls
			chainId={chainId}
			salesContractAddress={salesContractAddress}
			collectionAddress={collectionAddress}
			tokenIds={tokenIds}
			isLoading={isLoading}
		/>
	);

	return (
		<CollectiblesPageController
			onCollectibleClick={handleCollectibleClick}
			showMarketTypeToggle={true}
			showFilters={true}
			showSaleControls={true}
			renderSaleControls={renderSaleControls}
		/>
	);
}
