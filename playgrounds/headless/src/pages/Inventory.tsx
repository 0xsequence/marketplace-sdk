import {
	type CollectibleWithBalance,
	useInventory,
	useMarketplaceConfig,
} from '@0xsequence/marketplace-sdk/react';
import { useNavigate } from 'react-router';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';

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
			<div className="py-12 text-center">
				<h2 className="mb-2 font-semibold text-xl">Connect Wallet</h2>
				<p className="text-gray-400">
					Connect your wallet to view your inventory
				</p>
			</div>
		);
	}

	if (!collectionAddress) {
		return (
			<div className="py-12 text-center">
				<h2 className="mb-2 font-semibold text-xl">No Collections</h2>
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
			<h2 className="mb-2 font-bold text-2xl">Your Inventory</h2>
			<p className="mb-6 text-gray-400 text-sm">
				Showing items from: {collectionAddress}
			</p>

			{collectibles.length === 0 ? (
				<p className="text-gray-400">No items in your inventory</p>
			) : (
				<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
					{collectibles.map((item: CollectibleWithBalance) => (
						<button
							key={`${chainId}-${item.contractInfo?.address}-${item.metadata.tokenId}`}
							onClick={() =>
								navigate(
									`/market/${chainId}/${item.contractInfo?.address}/${item.metadata.tokenId}`,
								)
							}
							className="w-full overflow-hidden rounded-lg border border-gray-700 bg-gray-800 text-left transition-colors hover:border-gray-500"
							type="button"
						>
							{item.metadata?.image ? (
								<img
									src={item.metadata.image}
									alt={
										item.metadata?.name ||
										`Token ${item.metadata.tokenId.toString()}`
									}
									className="aspect-square w-full object-cover"
								/>
							) : (
								<div className="flex aspect-square w-full items-center justify-center bg-gray-700">
									<span className="text-gray-500">No image</span>
								</div>
							)}
							<div className="p-3">
								<p className="truncate font-medium">
									{item.metadata?.name ||
										`#${item.metadata.tokenId.toString()}`}
								</p>
								<p className="text-gray-400 text-sm">Balance: {item.balance}</p>
							</div>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
