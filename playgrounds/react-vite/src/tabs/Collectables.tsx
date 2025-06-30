import { useNavigate, useParams } from 'react-router';
import {
	CollectiblesPageController,
	createRoute,
	ERC721SaleControls,
} from 'shared-components';
import type { Address } from 'viem';

export function Collectibles() {
	const navigate = useNavigate();
	const { collectionAddress, chainId } = useParams<{
		collectionAddress: Address;
		chainId: string;
	}>();

	const handleCollectibleClick = (tokenId: string) => {
		const route = createRoute.collectible(
			Number(chainId),
			collectionAddress as string,
			tokenId,
		);
		navigate(route);
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
			renderSaleControls={renderSaleControls}
			showMarketTypeToggle={true}
			showFilters={true}
			showSaleControls={true}
		/>
	);
}
