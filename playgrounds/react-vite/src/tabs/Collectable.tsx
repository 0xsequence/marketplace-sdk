import { useLocation, useNavigate, useParams } from 'react-router';
import { CollectiblePageController, createRoute } from 'shared-components';
import type { Address } from 'viem';

export function Collectible() {
	const navigate = useNavigate();
	const location = useLocation();
	const { collectionAddress, chainId, tokenId, salesAddress, itemAddress } =
		useParams<{
			collectionAddress?: Address;
			salesAddress?: Address;
			itemAddress?: Address;
			chainId: string;
			tokenId: string;
		}>();

	const isShop = location.pathname.startsWith('/shop');

	const route =
		isShop && salesAddress && itemAddress
			? createRoute.shopCollectibles(Number(chainId), salesAddress, itemAddress)
			: createRoute.marketCollectibles(
					Number(chainId),
					collectionAddress as string,
				);

	return (
		<CollectiblePageController
			onCollectionClick={() => {
				navigate(route);
			}}
			showFullLayout={true}
			chainId={Number(chainId)}
			collectionAddress={(isShop ? itemAddress : collectionAddress) as Address}
			tokenId={BigInt(tokenId as string)}
			cardType={isShop ? 'shop' : 'market'}
		/>
	);
}
