import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router';
import {
	useInventory,
	useMarketplaceConfig,
	type CollectibleWithBalance,
} from '@0xsequence/marketplace-sdk/react';
import type { Address } from 'viem';

export function Inventory() {
	const navigate = useNavigate();
	const { address, isConnected } = useAccount();

	const { data: marketplaceConfig } = useMarketplaceConfig();

	const firstCollection = marketplaceConfig?.market?.collections?.[0];
	const collectionAddress = firstCollection?.itemsAddress as Address;
	const chainId = firstCollection?.chainId ?? 0;

	const { data: inventoryData, isLoading } = useInventory({
		userAddress: address as Address,
		collectionAddress,
		chainId,
		query: {
			enabled: isConnected && !!address && !!collectionAddress,
		},
	});

	if (!isConnected) {
		return (
			<div className="text-center py-12">
				<h2 className="text-xl font-semibold mb-2">Connect Wallet</h2>
				<p className="text-gray-400">
					Connect your wallet to view your inventory
				</p>
			</div>
		);
	}

	if (!collectionAddress) {
		return (
			<div className="text-center py-12">
				<h2 className="text-xl font-semibold mb-2">No Collections</h2>
				<p className="text-gray-400">
					No marketplace collections are configured
				</p>
			</div>
		);
	}

	if (isLoading) {
		return <div className="text-gray-400">Loading inventory...</div>;
	}

	const collectibles = inventoryData?.collectibles ?? [];

	return (
		<div>
			<h2 className="text-2xl font-bold mb-2">Your Inventory</h2>
			<p className="text-gray-400 text-sm mb-6">
				Showing items from: {collectionAddress}
			</p>

			{collectibles.length === 0 ? (
				<p className="text-gray-400">No items in your inventory</p>
			) : (
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{collectibles.map((item: CollectibleWithBalance) => (
						<button
							key={`${chainId}-${item.contractInfo?.address}-${item.metadata.tokenId}`}
							onClick={() =>
								navigate(
									`/market/${chainId}/${item.contractInfo?.address}/${item.metadata.tokenId}`,
								)
							}
							className="text-left bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-500 transition-colors w-full"
							type="button"
						>
							{item.metadata?.image ? (
								<img
									src={item.metadata.image}
									alt={
										item.metadata?.name ||
										`Token ${item.metadata.tokenId.toString()}`
									}
									className="w-full aspect-square object-cover"
								/>
							) : (
								<div className="w-full aspect-square bg-gray-700 flex items-center justify-center">
									<span className="text-gray-500">No image</span>
								</div>
							)}
							<div className="p-3">
								<p className="font-medium truncate">
									{item.metadata?.name ||
										`#${item.metadata.tokenId.toString()}`}
								</p>
								<p className="text-sm text-gray-400">Balance: {item.balance}</p>
							</div>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
