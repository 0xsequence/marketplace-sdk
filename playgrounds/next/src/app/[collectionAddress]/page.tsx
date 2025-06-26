'use client';

import { useParams, useRouter } from 'next/navigation';
import { CollectiblesPageController, createRoute } from 'shared-components';

export default function CollectiblesPage() {
	const router = useRouter();
	const { collectionAddress } = useParams();

	const handleCollectibleClick = (tokenId: string) => {
		const route = createRoute.collectible(collectionAddress as string, tokenId);
		router.push(route);
	};

	return (
		<CollectiblesPageController onCollectibleClick={handleCollectibleClick} />
	);
}
