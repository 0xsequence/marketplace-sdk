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
import { type Address, isAddress } from 'viem';
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
	const isValidAddress = collectionAddress && isAddress(collectionAddress);
	const validAddress = isValidAddress
		? (collectionAddress as Address)
		: undefined;
	const tokenIdBigInt = BigInt(tokenId ?? '0');
	const { isConnected } = useAccount();

	const buyModal = useBuyModal();
	const createListingModal = useCreateListingModal();
	const makeOfferModal = useMakeOfferModal();
	const sellModal = useSellModal();
	const transferModal = useTransferModal();

	const {
		data: metadata,
		isLoading: metadataLoading,
		error: metadataError,
	} = useCollectibleMetadata({
		chainId: parsedChainId,
		collectionAddress: validAddress!,
		tokenId: tokenIdBigInt,
	});

	const { data: listingsData } = useCollectibleMarketListings({
		chainId: parsedChainId,
		collectionAddress: validAddress!,
		tokenId: tokenIdBigInt,
	});

	const { data: offersData } = useCollectibleMarketOffers({
		chainId: parsedChainId,
		collectionAddress: validAddress!,
		tokenId: tokenIdBigInt,
	});

	const { data: lowestListing } = useCollectibleMarketLowestListing({
		chainId: parsedChainId,
		collectionAddress: validAddress!,
		tokenId: tokenIdBigInt,
	});

	const { data: highestOffer } = useCollectibleMarketHighestOffer({
		chainId: parsedChainId,
		collectionAddress: validAddress!,
		tokenId: tokenIdBigInt,
	});

	const listings = listingsData?.listings ?? [];
	const offers = offersData?.offers ?? [];

	const handleBuyNow = () => {
		if (!lowestListing || !validAddress) return;

		buyModal.show({
			chainId: parsedChainId,
			collectionAddress: validAddress,
			tokenId: tokenIdBigInt,
			orderId: lowestListing.orderId,
			marketplace: lowestListing.marketplace as MarketplaceKind,
		});
		openModal('buy');
	};

	const handleMakeOffer = () => {
		if (!validAddress) return;

		makeOfferModal.show({
			chainId: parsedChainId,
			collectionAddress: validAddress,
			tokenId: tokenIdBigInt,
		});
		openModal('offer');
	};

	const handleListForSale = () => {
		if (!validAddress) return;

		createListingModal.show({
			chainId: parsedChainId,
			collectionAddress: validAddress,
			tokenId: tokenIdBigInt,
		});
		openModal('list');
	};

	const handleTransfer = () => {
		if (!validAddress) return;

		transferModal.show({
			chainId: parsedChainId,
			collectionAddress: validAddress,
			tokenId: tokenIdBigInt,
		});
		openModal('transfer');
	};

	const handleBuyListing = (listing: Order) => {
		if (!validAddress) return;

		buyModal.show({
			chainId: parsedChainId,
			collectionAddress: validAddress,
			tokenId: tokenIdBigInt,
			orderId: listing.orderId,
			marketplace: listing.marketplace as MarketplaceKind,
		});
		openModal('buy');
	};

	const handleAcceptOffer = (offer: Order) => {
		if (!validAddress) return;

		sellModal.show({
			chainId: parsedChainId,
			collectionAddress: validAddress,
			tokenId: tokenIdBigInt,
			order: offer,
		});
		openModal('sell');
	};

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

	if (metadataError) {
		return (
			<div className="py-8 text-center">
				<p className="mb-2 text-red-400">Failed to load collectible</p>
				<p className="mb-4 text-gray-400 text-sm">
					{metadataError instanceof Error
						? metadataError.message
						: 'Unknown error'}
				</p>
				<button
					onClick={() => navigate(`/market/${chainId}/${collectionAddress}`)}
					className="text-blue-400 hover:underline"
					type="button"
				>
					Back to collection
				</button>
			</div>
		);
	}

	if (metadataLoading) {
		return <div className="text-gray-400">Loading collectible...</div>;
	}

	return (
		<div>
			<button
				onClick={() => navigate(`/market/${chainId}/${collectionAddress}`)}
				className="mb-4 text-blue-400 hover:underline"
				type="button"
			>
				&larr; Back to collection
			</button>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				<div>
					{metadata?.image ? (
						<img
							src={metadata.image}
							alt={metadata.name || `Token ${tokenId}`}
							className="w-full rounded-lg"
						/>
					) : (
						<div className="flex aspect-square w-full items-center justify-center rounded-lg bg-gray-700">
							<span className="text-gray-500">No image</span>
						</div>
					)}
				</div>

				<div>
					<h1 className="mb-2 font-bold text-3xl">
						{metadata?.name || `Token #${tokenId}`}
					</h1>
					{metadata?.description && (
						<p className="mb-4 text-gray-300">{metadata.description}</p>
					)}

					<div className="mb-4 rounded-lg bg-gray-800 p-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-gray-400 text-sm">Lowest Listing</p>
								<p className="font-semibold text-lg">
									{lowestListing
										? `${lowestListing.priceAmount}`
										: 'No listings'}
								</p>
							</div>
							<div>
								<p className="text-gray-400 text-sm">Highest Offer</p>
								<p className="font-semibold text-lg">
									{highestOffer ? `${highestOffer.priceAmount}` : 'No offers'}
								</p>
							</div>
						</div>
					</div>

					{isConnected ? (
						<div className="mb-6 flex flex-wrap gap-2">
							<button
								onClick={handleBuyNow}
								disabled={!lowestListing}
								className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
								type="button"
							>
								Buy Now
							</button>
							<button
								onClick={handleMakeOffer}
								className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
								type="button"
							>
								Make Offer
							</button>
							<button
								onClick={handleListForSale}
								className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
								type="button"
							>
								List for Sale
							</button>
							<button
								onClick={handleTransfer}
								className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
								type="button"
							>
								Transfer
							</button>
						</div>
					) : (
						<p className="mb-6 text-gray-400">Connect wallet to interact</p>
					)}

					<div className="mb-6">
						<h3 className="mb-2 font-semibold text-lg">
							Listings ({listings.length})
						</h3>
						{listings.length > 0 ? (
							<div className="overflow-hidden rounded-lg bg-gray-800">
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
												className="border-gray-700 border-t"
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
						<h3 className="mb-2 font-semibold text-lg">
							Offers ({offers.length})
						</h3>
						{offers.length > 0 ? (
							<div className="overflow-hidden rounded-lg bg-gray-800">
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
												className="border-gray-700 border-t"
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
