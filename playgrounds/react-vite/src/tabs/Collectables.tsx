import { Box } from "@0xsequence/design-system";
import React from "react";
import {
  useListCollectibles,
  CollectibleCard,
  useCollection,
} from "@0xsequence/marketplace-sdk/react";
import { useMarketplace } from "../lib/MarketplaceContext";
import { ContractType, OrderSide } from "@0xsequence/marketplace-sdk";
import { useCollectionBalance } from "@0xsequence/kit";
import { useAccount } from "wagmi";

export function Collectibles() {
  const { collectionAddress, chainId, setCollectibleId, setActiveTab } =
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
      accountAddress: accountAddress!,
      includeMetadata: false,
    });

  return (
    <Box
      gap="3"
      paddingTop="3"
      display="grid"
      style={{
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
      }}
      alignItems="flex-start"
    >
      {collectiblesWithListings?.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.collectibles.map((collectibleLowestListing) => (
            <CollectibleCard
              key={collectibleLowestListing.metadata.tokenId}
              collectibleId={collectibleLowestListing.metadata.tokenId}
              chainId={chainId}
              collectionAddress={collectionAddress}
              collectionType={collection?.type as ContractType}
              lowestListing={collectibleLowestListing}
              onCollectibleClick={() => {
                setCollectibleId(collectibleLowestListing.metadata.tokenId);
                setActiveTab("collectible");
              }}
              onOfferClick={({ order }) => console.log(order)}
              balance={
                collectionBalance?.find(
                  (balance) =>
                    balance.tokenID ===
                    collectibleLowestListing.metadata.tokenId
                )?.balance
              }
              cardLoading={
                collectiblesWithListingsLoading ||
                collectionLoading ||
                collectionBalanceLoading
              }
            />
          ))}
        </React.Fragment>
      ))}
    </Box>
  );
}
