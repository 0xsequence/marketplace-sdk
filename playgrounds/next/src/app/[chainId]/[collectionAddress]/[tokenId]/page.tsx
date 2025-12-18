'use client';

import { useParams, useRouter } from 'next/navigation';
import { CollectiblePageController, createRoute } from 'shared-components';
import type { Address } from 'viem';

export default function CollectiblePage() {
	const router = useRouter();
	const { collectionAddress, chainId, tokenId } = useParams<{
		collectionAddress: string;
		chainId: string;
		tokenId: string;
	}>();
	const route = createRoute.marketCollectibles(
		Number(chainId),
		collectionAddress as string,
	);

	return (
		<CollectiblePageController
			showFullLayout={false}
			mediaClassName="h-[168px] w-[168px] overflow-hidden rounded-xl"
			onCollectionClick={() => {
				router.push(route);
			}}
			chainId={Number(chainId)}
			collectionAddress={collectionAddress as Address}
			tokenId={BigInt(tokenId)}
		/>
	);
}
