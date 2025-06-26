'use client';

import type { ContractInfo } from '@0xsequence/metadata';
import { useRouter } from 'next/navigation';
import { CollectionsPageController } from 'shared-components';

export default function HomePage() {
	const router = useRouter();

	const handleCollectionClick = (collection: ContractInfo) => {
		router.push(`/${collection.address}`);
	};

	return (
		<CollectionsPageController
			onCollectionClick={handleCollectionClick}
			className="pt-2"
		/>
	);
}
