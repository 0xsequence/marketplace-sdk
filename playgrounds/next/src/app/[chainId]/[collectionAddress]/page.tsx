'use client';

import { useParams, useRouter } from 'next/navigation';
import { CollectiblesPageController, createRoute } from 'shared-components';

export default function CollectiblesPage() {
	const router = useRouter();
	const { collectionAddress, chainId } = useParams<{
		collectionAddress: string;
		chainId: string;
	}>();

	const handleCollectibleClick = (tokenId: string) => {
		const route = createRoute.collectible(
			Number(chainId),
			collectionAddress as string,
			tokenId,
		);
		router.push(route);
	};

	return (
		<CollectiblesPageController
			onCollectibleClick={handleCollectibleClick}
			collectionAddress={collectionAddress as `0x${string}`}
			chainId={Number(chainId)}
		/>
	);
}
