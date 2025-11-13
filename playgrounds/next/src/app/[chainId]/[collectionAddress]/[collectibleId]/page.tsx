'use client';

import { useParams, useRouter } from 'next/navigation';
import { CollectiblePageController, createRoute } from 'shared-components';

export default function CollectiblePage() {
	const router = useRouter();
	const { collectionAddress, chainId, collectibleId } = useParams<{
		collectionAddress: string;
		chainId: string;
		collectibleId: string;
	}>();
	const route = createRoute.collectible(
		Number(chainId),
		collectionAddress as string,
		BigInt(collectibleId),
	);

	return (
		<CollectiblePageController
			showFullLayout={false}
			mediaClassName="h-[168px] w-[168px] overflow-hidden rounded-xl"
			onCollectionClick={() => {
				router.push(route);
			}}
			chainId={Number(chainId)}
			collectionAddress={collectionAddress as `0x${string}`}
			collectibleId={BigInt(collectibleId)}
		/>
	);
}
