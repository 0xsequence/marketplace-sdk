import type { MarketplaceKind, Order } from '@0xsequence/marketplace-sdk';
import {
	useBuyModal,
	useCollectibleMarketHighestOffer,
	useCollectibleMarketListings,
	useCollectibleMarketLowestListing,
	useCollectibleMarketOffers,
	useCollectibleMetadata,
	useCreateListingModal,
	useMakeOfferModal,
	useSellModal,
	useTransferModal,
} from '@0xsequence/marketplace-sdk/react';
import { useNavigate, useParams } from 'react-router';
import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import { openModal } from '../stores/modalStore';

export function Collectible() {
	const navigate = useNavigate();
	const { chainId, collectionAddress, tokenId } = useParams<{
		chainId: string;
		collectionAddress: string;
		tokenId: string;
	}>();

	const parsedChainId = Number(chainId);
	const tokenIdBigInt = BigInt(tokenId ?? '0');
	const { isConnected } = useAccount();

	const buyModal = useBuyModal();
	const createListingModal = useCreateListingModal();
	const makeOfferModal = useMakeOfferModal();
	const sellModal = useSellModal();
	const transferModal = useTransferModal();

	const { data: metadata, isLoading: metadataLoading } = useCollectibleMetadata(
		{
			chainId: parsedChainId,
			contractAddress: collectionAddress as Address,
			tokenId: tokenIdBigInt,
		},
	);

	const { data: listingsData } = useCollectibleMarketListings({
		chainId: parsedChainId,
		collectionAddress: collectionAddress as Address,
		tokenId: tokenIdBigInt,
	});

	const { data: offersData } = useCollectibleMarketOffers({
		chainId: parsedChainId,
		collectionAddress: collectionAddress as Address,
		tokenId: tokenIdBigInt,
	});

	const { data: lowestListing } = useCollectibleMarketLowestListing({
		chainId: parsedChainId,
		collectionAddress: collectionAddress as Address,
		tokenId: tokenIdBigInt,
	});

	const { data: highestOffer } = useCollectibleMarketHighestOffer({
		chainId: parsedChainId,
		collectionAddress: collectionAddress as Address,
		tokenId: tokenIdBigInt,
	});

	const listings = listingsData?.listings ?? [];
	const offers = offersData?.offers ?? [];

	const handleBuyNow = () => {
		if (!lowestListing) return;

		buyModal.show({
			chainId: parsedChainId,
			collectionAddress: collectionAddress as Address,
			tokenId: tokenIdBigInt,
			orderId: lowestListing.orderId,
			marketplace: lowestListing.marketplace as MarketplaceKind,
		});
		openModal('buy');
	};

	const handleMakeOffer = () => {
		makeOfferModal.show({
			chainId: parsedChainId,
			collectionAddress: collectionAddress as Address,
			tokenId: tokenIdBigInt,
		});
		openModal('offer');
	};

	const handleListForSale = () => {
		createListingModal.show({
			chainId: parsedChainId,
			collectionAddress: collectionAddress as Address,
			tokenId: tokenIdBigInt,
		});
		openModal('list');
	};

	const handleTransfer = () => {
		transferModal.show({
			chainId: parsedChainId,
			collectionAddress: collectionAddress as Address,
			tokenId: tokenIdBigInt,
		});
		openModal('transfer');
	};

	const handleBuyListing = (listing: Order) => {
		buyModal.show({
			chainId: parsedChainId,
			collectionAddress: collectionAddress as Address,
			tokenId: tokenIdBigInt,
			orderId: listing.orderId,
			marketplace: listing.marketplace as MarketplaceKind,
		});
		openModal('buy');
	};

	const handleAcceptOffer = (offer: Order) => {
		sellModal.show({
			chainId: parsedChainId,
			collectionAddress: collectionAddress as Address,
			tokenId: tokenIdBigInt,
			order: offer,
		});
		openModal('sell');
	};

	if (metadataLoading) {
		return <div className="text-gray-400">Loading collectible...</div>;
	}

	return (
		<div>
			<button
				onClick={() => navigate(`/market/${chainId}/${collectionAddress}`)}
				className="text-blue-400 hover:underline mb-4"
				type="button"
			>
				← Back to collection
			</button>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div>
					{metadata?.image ? (
						<img
							src={metadata.image}
							alt={metadata.name || `Token ${tokenId}`}
							className="w-full rounded-lg"
						/>
					) : (
						<div className="w-full aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
							<span className="text-gray-500">No image</span>
						</div>
					)}
				</div>

				<div>
					<h1 className="text-3xl font-bold mb-2">
						{metadata?.name || `Token #${tokenId}`}
					</h1>
					{metadata?.description && (
						<p className="text-gray-300 mb-4">{metadata.description}</p>
					)}

					<div className="bg-gray-800 rounded-lg p-4 mb-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-gray-400 text-sm">Lowest Listing</p>
								<p className="text-lg font-semibold">
									{lowestListing
										? `${lowestListing.priceAmount}`
										: 'No listings'}
								</p>
							</div>
							<div>
								<p className="text-gray-400 text-sm">Highest Offer</p>
								<p className="text-lg font-semibold">
									{highestOffer ? `${highestOffer.priceAmount}` : 'No offers'}
								</p>
							</div>
						</div>
					</div>

					{isConnected ? (
						<div className="flex flex-wrap gap-2 mb-6">
							<button
								onClick={handleBuyNow}
								disabled={!lowestListing}
								className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
								type="button"
							>
								Buy Now
							</button>
							<button
								onClick={handleMakeOffer}
								className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
								type="button"
							>
								Make Offer
							</button>
							<button
								onClick={handleListForSale}
								className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
								type="button"
							>
								List for Sale
							</button>
							<button
								onClick={handleTransfer}
								className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
								type="button"
							>
								Transfer
							</button>
						</div>
					) : (
						<p className="text-gray-400 mb-6">Connect wallet to interact</p>
					)}

					<div className="mb-6">
						<h3 className="text-lg font-semibold mb-2">
							Listings ({listings.length})
						</h3>
						{listings.length > 0 ? (
							<div className="bg-gray-800 rounded-lg overflow-hidden">
								<table className="w-full">
									<thead className="bg-gray-700">
										<tr>
											<th className="px-4 py-2 text-left">Price</th>
											<th className="px-4 py-2 text-left">Seller</th>
											<th className="px-4 py-2 text-left">Action</th>
										</tr>
									</thead>
									<tbody>
										{listings.map((listing) => (
											<tr
												key={listing.orderId}
												className="border-t border-gray-700"
											>
												<td className="px-4 py-2">{listing.priceAmount}</td>
												<td className="px-4 py-2 font-mono text-sm">
													{listing.createdBy?.slice(0, 6)}...
													{listing.createdBy?.slice(-4)}
												</td>
												<td className="px-4 py-2">
													<button
														onClick={() => handleBuyListing(listing)}
														disabled={!isConnected}
														className="text-blue-400 hover:underline disabled:opacity-50"
														type="button"
													>
														Buy
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<p className="text-gray-400">No active listings</p>
						)}
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-2">
							Offers ({offers.length})
						</h3>
						{offers.length > 0 ? (
							<div className="bg-gray-800 rounded-lg overflow-hidden">
								<table className="w-full">
									<thead className="bg-gray-700">
										<tr>
											<th className="px-4 py-2 text-left">Price</th>
											<th className="px-4 py-2 text-left">From</th>
											<th className="px-4 py-2 text-left">Action</th>
										</tr>
									</thead>
									<tbody>
										{offers.map((offer) => (
											<tr
												key={offer.orderId}
												className="border-t border-gray-700"
											>
												<td className="px-4 py-2">{offer.priceAmount}</td>
												<td className="px-4 py-2 font-mono text-sm">
													{offer.createdBy?.slice(0, 6)}...
													{offer.createdBy?.slice(-4)}
												</td>
												<td className="px-4 py-2">
													<button
														onClick={() => handleAcceptOffer(offer)}
														disabled={!isConnected}
														className="text-green-400 hover:underline disabled:opacity-50"
														type="button"
													>
														Accept
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<p className="text-gray-400">No active offers</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
