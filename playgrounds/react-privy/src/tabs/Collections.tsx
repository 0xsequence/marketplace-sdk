import type { ContractInfo } from '@0xsequence/metadata';
import { CollectionsPageController } from 'shared-components';
import { useReactRouterNavigation } from '../components/routing/ReactRouterAdapters';
import { ROUTES } from '../lib/routes';

export function Collections() {
	const { navigateTo } = useReactRouterNavigation();

	const handleCollectionClick = (_collection: ContractInfo) => {
		// Navigate to collectibles page for this collection
		// Collection state is managed by shared store
		navigateTo(`/${ROUTES.COLLECTIBLES.path}`);
	};

	return (
		<CollectionsPageController
			onCollectionClick={handleCollectionClick}
			showMarketTypeToggle={true}
		/>
	);
}
