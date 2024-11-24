import { Box } from "@0xsequence/design-system";
import React from "react";
import {
  useListCollectibles,
  CollectibleCard,
} from "@0xsequence/marketplace-sdk/react";
import { useMarketplace } from "../lib/MarketplaceContext";
import { OrderSide } from "@0xsequence/marketplace-sdk";

export function Collectibles() {
  const { collectionAddress, chainId } = useMarketplace();
  const { data: collectibles } = useListCollectibles({
    collectionAddress,
    chainId,
    side: OrderSide.listing,
  });

  return (
    <Box
      gap="3"
      paddingTop="3"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
      }}
    >
      {collectibles?.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.collectibles.map((collectible) => (
            <CollectibleCard
              key={collectible.metadata.tokenId}
              chainId={chainId}
              collectionAddress={collectionAddress}
              tokenId={collectible.metadata.tokenId}
              onCollectibleClick={() => console.log("Collectible clicked")}
              onOfferClick={() => console.log("Offer clicked")}
            />
          ))}
        </React.Fragment>
      ))}
    </Box>
  );
}
