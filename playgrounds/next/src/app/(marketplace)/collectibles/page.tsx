'use client';

import { useRouter } from 'next/navigation';
import { CollectiblesPageController, ROUTES } from 'shared-components';

export default function CollectiblesPage() {
	const router = useRouter();

	const handleCollectibleClick = (_tokenId: string) => {
		router.push(`/${ROUTES.COLLECTIBLE.path}`);
	};

	return (
		<CollectiblesPageController onCollectibleClick={handleCollectibleClick} />
	);
}
