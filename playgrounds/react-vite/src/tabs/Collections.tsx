import type { ContractInfo } from '@0xsequence/metadata';
import { useNavigate } from 'react-router';
import { CollectionsPageController } from 'shared-components';

export function Collections() {
	const navigate = useNavigate();

	const handleCollectionClick = (collection: ContractInfo) => {
		navigate(`/${collection.address}/collectibles`);
	};

	return (
		<CollectionsPageController
			onCollectionClick={handleCollectionClick}
			showMarketTypeToggle={true}
		/>
	);
}
