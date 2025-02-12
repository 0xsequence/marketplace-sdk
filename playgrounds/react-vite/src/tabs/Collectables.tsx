import { useToast } from '@0xsequence/design-system';
import { useCollectionBalance } from '@0xsequence/kit';
import { type ContractType, OrderSide } from '@0xsequence/marketplace-sdk';
import {
	CollectibleCard,
	useCollection,
	useListCollectibles,
} from '@0xsequence/marketplace-sdk/react';
import React from 'react';
import { useNavigate } from 'react-router';
import { useAccount } from 'wagmi';
import { useMarketplace } from '../lib/MarketplaceContext';
import { ROUTES } from '../lib/routes';
import { CollectibleCardAction } from '../../../../packages/sdk/src/react/ui/components/_internals/action-button/types';

export function Collectibles() {
	const navigate = useNavigate();
	const { collectionAddress, chainId, setCollectibleId, orderbookKind } =
		useMarketplace();
	const { address: accountAddress } = useAccount();
	const {
		data: collectiblesWithListings,
		isLoading: collectiblesWithListingsLoading,
	} = useListCollectibles({
		collectionAddress,
		chainId,
		side: OrderSide.listing,
		filter: {
			includeEmpty: true,
		},
	});
	const { data: collection, isLoading: collectionLoading } = useCollection({
		collectionAddress,
		chainId,
	});
	const { data: collectionBalance, isLoading: collectionBalanceLoading } =
		useCollectionBalance({
			contractAddress: collectionAddress,
			chainId: Number(chainId),
			accountAddress: accountAddress || '',
			includeMetadata: false,
		});
	const toast = useToast();

	return (
		<div
			className="grid gap-3 pt-3 items-start"
			style={{
				gridTemplateColumns: 'repeat(3, 1fr)',
				gap: '16px',
			}}
		>
			{collectiblesWithListings?.pages.map((group, i) => (
				<React.Fragment key={group.collectibles[0]?.metadata.tokenId || i}>
					{group.collectibles.map((collectibleLowestListing) => (
						<CollectibleCard
							key={collectibleLowestListing.metadata.tokenId}
							collectibleId={collectibleLowestListing.metadata.tokenId}
							chainId={chainId}
							collectionAddress={collectionAddress}
							orderbookKind={orderbookKind}
							collectionType={collection?.type as ContractType}
							lowestListing={collectibleLowestListing}
							onCollectibleClick={(tokenId) => {
								setCollectibleId(tokenId);
								navigate(`/${ROUTES.COLLECTIBLE.path}`);
							}}
							onOfferClick={({ order }) => console.log(order)}
							balance={
								collectionBalance?.find(
									(balance) =>
										balance.tokenID ===
										collectibleLowestListing.metadata.tokenId,
								)?.balance
							}
							cardLoading={
								collectiblesWithListingsLoading ||
								collectionLoading ||
								collectionBalanceLoading
							}
							onCannotPerformAction={(action) => {
								const label =
									action === CollectibleCardAction.BUY
										? 'buy'
										: 'make offer for';
								toast({
									title: `You cannot ${label} this collectible`,
									description: `You can only ${label} collectibles you do not own`,
									variant: 'error',
								});
							}}
						/>
					))}
				</React.Fragment>
			))}
		</div>
	);
}
