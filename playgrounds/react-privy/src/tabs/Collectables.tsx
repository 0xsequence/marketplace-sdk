import { CollectiblesPageController, ERC721SaleControls, ErrorBoundary } from 'shared-components';
import type { Address } from 'viem';
import { useReactRouterNavigation } from '../components/routing/ReactRouterAdapters';
import { ROUTES } from '../lib/routes';

export function Collectibles() {
	const { navigateTo } = useReactRouterNavigation();

	const handleCollectibleClick = (tokenId: string) => {
		navigateTo(`/${ROUTES.COLLECTIBLE.path}/${tokenId}`);
	};

	const renderSaleControls = ({
		chainId,
		salesContractAddress,
		collectionAddress,
		tokenIds,
		isLoading,
	}: {
		chainId: number;
		salesContractAddress: Address;
		collectionAddress: Address;
		tokenIds: string[];
		isLoading: boolean;
	}) => (
		<ERC721SaleControls
			chainId={chainId}
			salesContractAddress={salesContractAddress}
			collectionAddress={collectionAddress}
			tokenIds={tokenIds}
			isLoading={isLoading}
		/>
	);

	return (
		<ErrorBoundary>
			<CollectiblesPageController
				onCollectibleClick={handleCollectibleClick}
				showMarketTypeToggle={true}
				showFilters={true}
				showSaleControls={true}
				renderSaleControls={renderSaleControls}
			/>
		</ErrorBoundary>
	);
}
