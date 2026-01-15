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
			<h2 className="mb-6 font-bold text-2xl">Collections</h2>

			{collections.length === 0 ? (
				<p className="text-gray-400">No collections configured</p>
			) : (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
			className="w-full overflow-hidden rounded-lg border border-gray-700 bg-gray-800 text-left transition-colors hover:border-gray-500"
			type="button"
		>
			{collection.bannerUrl ? (
				<img
					src={collection.bannerUrl}
					alt=""
					className="h-32 w-full object-cover"
				/>
			) : (
				<div className="flex h-32 w-full items-center justify-center bg-gray-700">
					<span className="text-gray-500">No image</span>
				</div>
			)}
			<div className="p-4">
				<p className="text-gray-400 text-sm">Chain: {collection.chainId}</p>
				<p className="truncate font-mono text-gray-300 text-sm">
					{collection.itemsAddress}
				</p>
			</div>
		</button>
	);
}
