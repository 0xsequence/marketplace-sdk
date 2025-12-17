'use client';

import { useParams, useRouter } from 'next/navigation';
import { CollectiblesPageController, createRoute } from 'shared-components';
import type { Address } from 'viem';

export default function CollectiblesPage() {
	const router = useRouter();
	const { collectionAddress, chainId } = useParams<{
		collectionAddress: string;
		chainId: string;
	}>();

	const handleCollectibleClick = (tokenId: bigint) => {
		const route = createRoute.marketCollectible(
			Number(chainId),
			collectionAddress as string,
			BigInt(tokenId),
		);
		router.push(route);
	};

	return (
		<CollectiblesPageController
			onCollectibleClick={handleCollectibleClick}
			collectionAddress={collectionAddress as Address}
			chainId={Number(chainId)}
		/>
	);
}
