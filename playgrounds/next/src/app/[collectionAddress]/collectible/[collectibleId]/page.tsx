'use client';

import { useParams, useRouter } from 'next/navigation';
import { CollectiblePageController } from 'shared-components';

export default function CollectiblePage() {
	const router = useRouter();
	const { collectionAddress } = useParams();

	return (
		<CollectiblePageController
			showFullLayout={false}
			mediaClassName="h-[168px] w-[168px] overflow-hidden rounded-xl"
			onCollectionClick={() => {
				router.push(`/${collectionAddress}/items`);
			}}
		/>
	);
}
