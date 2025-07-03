import { useNavigate } from 'react-router';
import {
	createRoute,
	ShopContent as SharedShopContent,
} from 'shared-components';
import type { Address } from 'viem';

export interface ShopContentProps {
	saleContractAddress: Address;
	saleItemIds: string[];
	collectionAddress: Address;
	chainId: number;
}

export function ShopContent({
	saleContractAddress,
	saleItemIds,
	collectionAddress,
	chainId,
}: ShopContentProps) {
	const navigate = useNavigate();

	function handleCollectibleClick(tokenId: string) {
		const route = createRoute.collectible(chainId, collectionAddress, tokenId);
		navigate(route);
	}

	return (
		<SharedShopContent
			saleContractAddress={saleContractAddress}
			saleItemIds={saleItemIds}
			collectionAddress={collectionAddress}
			chainId={chainId}
			onCollectibleClick={handleCollectibleClick}
		/>
	);
}
