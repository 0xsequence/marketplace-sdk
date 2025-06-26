'use client';

import { useParams, useRouter } from 'next/navigation';
import { CollectiblesPageController } from 'shared-components';

export default function CollectiblesPage() {
	const router = useRouter();
	const { collectionAddress } = useParams();

	const handleCollectibleClick = (tokenId: string) => {
		router.push(`/${collectionAddress}/${tokenId}`);
	};

	return (
		<CollectiblesPageController onCollectibleClick={handleCollectibleClick} />
	);
}
