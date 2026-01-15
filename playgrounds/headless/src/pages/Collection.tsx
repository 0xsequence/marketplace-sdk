import { useParams, useNavigate } from 'react-router';
import {
	useCollectionMetadata,
	useCollectibleMarketList,
} from '@0xsequence/marketplace-sdk/react';
import { OrderSide } from '@0xsequence/marketplace-sdk';
import type { Address } from 'viem';

export function Collection() {
	const navigate = useNavigate();
	const { chainId, collectionAddress } = useParams<{
		chainId: string;
		collectionAddress: string;
	}>();

	const parsedChainId = Number(chainId);

	const { data: metadata, isLoading: metadataLoading } = useCollectionMetadata({
		chainId: parsedChainId,
		collectionAddress: collectionAddress as Address,
	});

	const { data: collectiblesData, isLoading: collectiblesLoading } =
		useCollectibleMarketList({
			chainId: parsedChainId,
			collectionAddress: collectionAddress as Address,
			side: OrderSide.listing,
		});

	if (metadataLoading || collectiblesLoading) {
		return <div className="text-gray-400">Loading collection...</div>;
	}

	const collectibles =
		collectiblesData?.pages?.flatMap((p) => p.collectibles) ?? [];

	return (
		<div>
			<button
				onClick={() => navigate('/market')}
				className="text-blue-400 hover:underline mb-2"
				type="button"
			>
				← Back to collections
			</button>
			<h2 className="text-2xl font-bold">
				{metadata?.name || 'Unknown Collection'}
			</h2>
			<p className="text-gray-400 font-mono text-sm">{collectionAddress}</p>
			<p className="text-gray-400 text-sm mb-6">Chain ID: {chainId}</p>
			{metadata?.extensions?.description && (
				<p className="text-gray-300 mb-6">{metadata.extensions.description}</p>
			)}

			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{collectibles.map((item) => (
					<button
						key={item.metadata.tokenId}
						onClick={() =>
							navigate(
								`/market/${chainId}/${collectionAddress}/${item.metadata.tokenId}`,
							)
						}
						className="text-left bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-500 transition-colors w-full"
						type="button"
					>
						{item.metadata?.image ? (
							<img
								src={item.metadata.image}
								alt={item.metadata?.name || `Token ${item.metadata.tokenId}`}
								className="w-full aspect-square object-cover"
							/>
						) : (
							<div className="w-full aspect-square bg-gray-700 flex items-center justify-center">
								<span className="text-gray-500">No image</span>
							</div>
						)}
						<div className="p-3">
							<p className="font-medium truncate">
								{item.metadata?.name || `#${item.metadata.tokenId}`}
							</p>
							<p className="text-sm text-gray-400">#{item.metadata.tokenId}</p>
							{item.listing?.priceAmount && (
								<p className="text-sm text-green-400 mt-1">
									{item.listing.priceAmount}
								</p>
							)}
						</div>
					</button>
				))}
			</div>

			{collectibles.length === 0 && (
				<p className="text-gray-400">No items found in this collection</p>
			)}
		</div>
	);
}
