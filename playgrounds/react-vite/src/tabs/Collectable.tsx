import { useNavigate, useParams } from 'react-router';
import { CollectiblePageController, createRoute } from 'shared-components';
import type { Address } from 'viem';

export function Collectible() {
	const navigate = useNavigate();
	const { collectionAddress, chainId, collectibleId } = useParams();
	const route = createRoute.collectibles(
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
			collectionAddress={collectionAddress as Address}
			collectibleId={BigInt(collectibleId as string)}
		/>
	);
}
