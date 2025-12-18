import { useNavigate, useParams } from 'react-router';
import {
	createRoute,
	MarketContent as SharedMarketContent,
} from 'shared-components';
import type { Address } from 'viem';

export function MarketContent() {
	const navigate = useNavigate();
	const { collectionAddress, chainId } = useParams<{
		collectionAddress: string;
		chainId: string;
	}>();

	function handleCollectibleClick(tokenId: bigint) {
		if (!collectionAddress || !chainId) return;

		const route = createRoute.marketCollectible(
			Number(chainId),
			collectionAddress,
			tokenId,
		);
		navigate(route);
	}

	if (!collectionAddress || !chainId) {
		return <div>Missing collection address or chain ID</div>;
	}

	return (
		<SharedMarketContent
			collectionAddress={collectionAddress as Address}
			chainId={Number(chainId)}
			onCollectibleClick={handleCollectibleClick}
		/>
	);
}
