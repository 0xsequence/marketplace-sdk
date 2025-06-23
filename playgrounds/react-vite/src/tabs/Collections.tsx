import type { ContractInfo } from '@0xsequence/metadata';
import { useNavigate } from 'react-router';
import { CollectionsPageController } from 'shared-components';
import { ROUTES } from 'shared-components';

export function Collections() {
	const navigate = useNavigate();

	const handleCollectionClick = (_collection: ContractInfo) => {
		navigate(`/${ROUTES.COLLECTIBLES.path}`);
	};

	return (
		<CollectionsPageController
			onCollectionClick={handleCollectionClick}
			showMarketTypeToggle={true}
		/>
	);
}
