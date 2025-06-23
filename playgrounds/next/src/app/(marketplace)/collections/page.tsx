'use client';

import type { ContractInfo } from '@0xsequence/metadata';
import { useRouter } from 'next/navigation';
import { CollectionsPageController, ROUTES } from 'shared-components';

export default function CollectionsPage() {
	const router = useRouter();

	const handleCollectionClick = (_collection: ContractInfo) => {
		router.push(`/${ROUTES.COLLECTIBLES.path}`);
	};

	return (
		<CollectionsPageController
			onCollectionClick={handleCollectionClick}
			className="pt-2"
		/>
	);
}
