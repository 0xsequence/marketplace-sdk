import { OrderSide } from '@0xsequence/marketplace-sdk';
import {
	useCollectibleMarketList,
	useCollectionMetadata,
} from '@0xsequence/marketplace-sdk/react';
import { useNavigate, useParams } from 'react-router';
import { type Address, isAddress } from 'viem';

export function Collection() {
	const navigate = useNavigate();
	const { chainId, collectionAddress } = useParams<{
		chainId: string;
		collectionAddress: string;
	}>();

	const parsedChainId = Number(chainId);
	const isValidAddress = collectionAddress && isAddress(collectionAddress);
	const validAddress = isValidAddress
		? (collectionAddress as Address)
		: undefined;

	const {
		data: metadata,
		isLoading: metadataLoading,
		error: metadataError,
	} = useCollectionMetadata({
		chainId: parsedChainId,
		collectionAddress: validAddress!,
	});

	const {
		data: collectiblesData,
		isLoading: collectiblesLoading,
		error: collectiblesError,
	} = useCollectibleMarketList({
		chainId: parsedChainId,
		collectionAddress: validAddress!,
		side: OrderSide.listing,
	});

	if (!isValidAddress) {
		return (
			<div className="py-8 text-center">
				<p className="text-red-400">Invalid collection address</p>
				<button
					onClick={() => navigate('/market')}
					className="mt-4 text-blue-400 hover:underline"
					type="button"
				>
					Back to collections
				</button>
			</div>
		);
	}

	if (metadataError || collectiblesError) {
		const error = metadataError || collectiblesError;
		return (
			<div className="py-8 text-center">
				<p className="mb-2 text-red-400">Failed to load collection</p>
				<p className="mb-4 text-gray-400 text-sm">
					{error instanceof Error ? error.message : 'Unknown error'}
				</p>
				<button
					onClick={() => navigate('/market')}
					className="text-blue-400 hover:underline"
					type="button"
				>
					Back to collections
				</button>
			</div>
		);
	}

	if (metadataLoading || collectiblesLoading) {
		return <div className="text-gray-400">Loading collection...</div>;
	}

	const collectibles =
		collectiblesData?.pages?.flatMap((p) => p.collectibles) ?? [];

	return (
		<div>
			<button
				onClick={() => navigate('/market')}
				className="mb-2 text-blue-400 hover:underline"
				type="button"
			>
				&larr; Back to collections
			</button>
			<h2 className="font-bold text-2xl">
				{metadata?.name || 'Unknown Collection'}
			</h2>
			<p className="font-mono text-gray-400 text-sm">{collectionAddress}</p>
			<p className="mb-6 text-gray-400 text-sm">Chain ID: {chainId}</p>
			{metadata?.extensions?.description && (
				<p className="mb-6 text-gray-300">{metadata.extensions.description}</p>
			)}

			<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
				{collectibles.map((item) => (
					<button
						key={item.metadata.tokenId}
						onClick={() =>
							navigate(
								`/market/${chainId}/${collectionAddress}/${item.metadata.tokenId}`,
							)
						}
						className="w-full overflow-hidden rounded-lg border border-gray-700 bg-gray-800 text-left transition-colors hover:border-gray-500"
						type="button"
					>
						{item.metadata?.image ? (
							<img
								src={item.metadata.image}
								alt={item.metadata?.name || `Token ${item.metadata.tokenId}`}
								className="aspect-square w-full object-cover"
							/>
						) : (
							<div className="flex aspect-square w-full items-center justify-center bg-gray-700">
								<span className="text-gray-500">No image</span>
							</div>
						)}
						<div className="p-3">
							<p className="truncate font-medium">
								{item.metadata?.name || `#${item.metadata.tokenId}`}
							</p>
							<p className="text-gray-400 text-sm">#{item.metadata.tokenId}</p>
							{item.listing?.priceAmount && (
								<p className="mt-1 text-green-400 text-sm">
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
