import { useMarketplaceConfig } from '@0xsequence/marketplace-sdk/react';
import { useNavigate } from 'react-router';

export function Home() {
	const navigate = useNavigate();
	const { data: config, isLoading } = useMarketplaceConfig();

	if (isLoading) {
		return <div className="text-gray-400">Loading collections...</div>;
	}

	const collections = config?.market.collections ?? [];

	return (
		<div>
			<h2 className="text-2xl font-bold mb-6">Collections</h2>

			{collections.length === 0 ? (
				<p className="text-gray-400">No collections configured</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{collections.map((collection) => (
						<CollectionCard
							key={`${collection.chainId}-${collection.itemsAddress}`}
							collection={collection}
							onClick={() =>
								navigate(
									`/market/${collection.chainId}/${collection.itemsAddress}`,
								)
							}
						/>
					))}
				</div>
			)}
		</div>
	);
}

function CollectionCard({
	collection,
	onClick,
}: {
	collection: {
		chainId: number;
		itemsAddress: string;
		bannerUrl?: string;
	};
	onClick: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className="text-left bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-500 transition-colors w-full"
			type="button"
		>
			{collection.bannerUrl ? (
				<img
					src={collection.bannerUrl}
					alt=""
					className="w-full h-32 object-cover"
				/>
			) : (
				<div className="w-full h-32 bg-gray-700 flex items-center justify-center">
					<span className="text-gray-500">No image</span>
				</div>
			)}
			<div className="p-4">
				<p className="text-sm text-gray-400">Chain: {collection.chainId}</p>
				<p className="text-sm text-gray-300 font-mono truncate">
					{collection.itemsAddress}
				</p>
			</div>
		</button>
	);
}
