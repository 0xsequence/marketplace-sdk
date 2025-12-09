import type { ContractInfo } from '@0xsequence/marketplace-sdk';
import { useNavigate } from 'react-router';
import { CollectionsPageController } from 'shared-components';

export function Collections() {
	const navigate = useNavigate();

	const handleCollectionClick = (collection: ContractInfo) => {
		navigate(`/${collection.chainId}/${collection.address}`);
	};

	return (
		<CollectionsPageController
			onCollectionClick={handleCollectionClick}
			showMarketTypeToggle={true}
		/>
	);
}
