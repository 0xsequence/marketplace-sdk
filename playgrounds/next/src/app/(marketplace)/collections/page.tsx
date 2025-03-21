'use client';

import { usePlayground } from '@/lib/PlaygroundContext';
import { ROUTES } from '@/lib/routes';
import { NetworkImage } from '@0xsequence/design-system2';
import type { ContractInfo } from '@0xsequence/indexer';
import { getNetwork } from '@0xsequence/kit';
import { useListCollections } from '@0xsequence/marketplace-sdk/react';
import { useRouter } from 'next/navigation';
import type { Hex } from 'viem';

function NetworkPill({ chainId }: { chainId: number }) {
	const network = getNetwork(chainId);
	return (
		<div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-gray-700/50 bg-gray-800/90 px-2.5 py-1 shadow-md backdrop-blur-sm">
			<span className="font-bold text-gray-200 text-xs">{network.name}</span>
			<NetworkImage chainId={chainId} className="h-5 w-5" />
		</div>
	);
}

export default function CollectionsPage() {
	const router = useRouter();
	const { data: collections, isLoading } = useListCollections();
	const { setChainId, setCollectionAddress, sdkConfig } = usePlayground();

	const handleCollectionClick = (collection: ContractInfo) => {
		setChainId(String(collection.chainId));
		setCollectionAddress(collection.address as Hex);
		router.push(`/${ROUTES.COLLECTIBLES.path}`);
	};

	if (collections?.length === 0 && !isLoading) {
		return (
			<div className="flex flex-col gap-4">
				<h2 className="font-semibold text-gray-100 text-xl">Collections</h2>
				<div className="flex justify-center rounded-xl border border-gray-700/30 bg-gray-800/80 p-6 pt-3 shadow-lg">
					<p className="text-gray-300">No collections found</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<h2 className="font-semibold text-gray-100 text-xl">Collections</h2>

			{isLoading ? (
				<div className="flex justify-center rounded-xl border border-gray-700/30 bg-gray-800/80 p-6 shadow-lg">
					<p className="text-gray-300">Loading collections...</p>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{collections?.map((collection: Partial<ContractInfo>) => (
						<button
							key={collection.address}
							type="button"
							onClick={() => handleCollectionClick(collection as ContractInfo)}
							className="group relative w-full overflow-hidden rounded-xl border border-gray-700/30 bg-gradient-to-br from-gray-800 to-gray-900 text-left shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-blue-800/40 hover:shadow-blue-900/20"
							aria-label={`View ${collection.name} collection`}
						>
							<NetworkPill chainId={collection.chainId as number} />

							{/* Collection Image */}
							<div
								className="h-56 w-full transition-transform duration-500 group-hover:scale-105"
								style={{
									backgroundImage: `url(${collection.extensions?.ogImage || '/placeholder-collection.jpg'})`,
									backgroundSize: 'cover',
									backgroundPosition: 'center',
								}}
							/>

							{/* Collection Info */}
							<div className="absolute right-0 bottom-0 left-0 w-full bg-gradient-to-t from-gray-900 via-gray-900/95 to-gray-900/0 p-4">
								<div className="space-y-1.5">
									<h3 className="truncate font-medium text-lg text-white transition-colors group-hover:text-blue-300">
										{collection.name || 'Unnamed Collection'}
									</h3>
									<div className="flex items-center">
										<p className="truncate font-mono text-gray-400 text-xs">
											{collection.address?.substring(0, 8)}...
											{collection.address?.substring(
												collection.address.length - 6,
											)}
										</p>
									</div>
									<div className="pt-1.5">
										<span className="inline-flex items-center rounded border border-blue-800/30 bg-blue-900/30 px-2 py-0.5 font-medium text-blue-300 text-xs">
											View Collection
										</span>
									</div>
								</div>
							</div>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
