import { Box } from "@0xsequence/design-system";
import React from "react";
import {
  useListCollectibles,
  CollectibleCard,
  useCollection,
} from "@0xsequence/marketplace-sdk/react";
import { useMarketplace } from "../lib/MarketplaceContext";
import { ContractType, OrderSide } from "@0xsequence/marketplace-sdk";

export function Collectibles() {
  const { collectionAddress, chainId, setCollectibleId, setActiveTab } =
    useMarketplace();
  const { data: collectibles } = useListCollectibles({
    collectionAddress,
    chainId,
    side: OrderSide.listing,
    filter: {
      includeEmpty: true,
    },
  });
  const { data: collection } = useCollection({ collectionAddress, chainId });

  return (
    <Box
      gap="3"
      paddingTop="3"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
      }}
      alignItems='flex-start'
    >
      {collectibles?.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.collectibles.map((collectibleOrder) => (
            <CollectibleCard
              key={collectibleOrder.metadata.tokenId}
              collectibleId={collectibleOrder.metadata.tokenId}
              chainId={chainId}
              collectionAddress={collectionAddress}
              collectionType={collection?.type as ContractType}
              onCollectibleClick={() => {
                setCollectibleId(collectibleOrder.metadata.tokenId);
                setActiveTab("collectible");
              }}
              onOfferClick={() => console.log("Offer clicked")}
            />
          ))}
        </React.Fragment>
      ))}
    </Box>
  );
}
