import type { ContractInfo } from '@0xsequence/marketplace-sdk';
import { useLocation, useNavigate } from 'react-router';
import { CollectionsPageController, createRoute } from 'shared-components';

export function Collections() {
	const navigate = useNavigate();
	const location = useLocation();

	const collectionType: 'market' | 'shop' = location.pathname.startsWith(
		'/shop',
	)
		? 'shop'
		: 'market';

	const handleCollectionClick = (
		collection: ContractInfo,
		cardType: 'market' | 'shop',
		salesAddress?: string,
	) => {
		if (cardType === 'shop' && salesAddress) {
			navigate(
				createRoute.shopCollectibles(
					collection.chainId,
					salesAddress,
					collection.address,
				),
			);
		} else {
			navigate(
				createRoute.marketCollectibles(collection.chainId, collection.address),
			);
		}
	};

	return (
		<CollectionsPageController
			onCollectionClick={handleCollectionClick}
			collectionType={collectionType}
		/>
	);
}
