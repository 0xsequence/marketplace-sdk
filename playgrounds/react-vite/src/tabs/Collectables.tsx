import { useNavigate, useParams } from 'react-router';
import {
	CollectiblesPageController,
	ERC721SaleControls,
} from 'shared-components';
import type { Address } from 'viem';

export function Collectibles() {
	const navigate = useNavigate();
	const { collectionAddress } = useParams<{ collectionAddress: Address }>();

	const handleCollectibleClick = (tokenId: string) => {
		navigate(`/${collectionAddress}/${tokenId}`);
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
